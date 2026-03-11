"""
Service layer — business logic for authentication.
"""
import requests
from typing import Tuple, Dict, Any

from django.conf import settings
from rest_framework_simplejwt.tokens import RefreshToken

from .models import User
from .repositories import UserRepository


GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"
GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo"


class AuthService:
    """Handles Google OAuth flow and JWT token management."""

    def __init__(self):
        self.user_repo = UserRepository()

    def google_authenticate(self, code: str, redirect_uri: str) -> Tuple[User, Dict[str, str]]:
        """
        Exchange Google auth code for tokens, create/get user, return JWT pair.
        """
        google_tokens = self._exchange_google_code(code, redirect_uri)
        google_user_info = self._get_google_user_info(google_tokens["access_token"])
        user = self._get_or_create_user(google_user_info)
        jwt_tokens = self._issue_jwt(user)
        return user, jwt_tokens

    def google_authenticate_with_token(self, id_token_str: str) -> Tuple[User, Dict[str, str]]:
        """
        Verify a Google ID token (from frontend @react-oauth/google), create/get user, return JWT.
        """
        google_user_info = self._verify_google_id_token(id_token_str)
        user = self._get_or_create_user(google_user_info)
        jwt_tokens = self._issue_jwt(user)
        return user, jwt_tokens

    # ------------------------------------------------------------------
    # Email / Password authentication
    # ------------------------------------------------------------------
    def register_user(self, email: str, username: str, password: str) -> Tuple[User, Dict[str, str]]:
        """Register a new user with email/password and return JWT pair."""
        user = self.user_repo.create_email_user(email=email, username=username, password=password)
        jwt_tokens = self._issue_jwt(user)
        return user, jwt_tokens

    def login_user(self, email: str, password: str) -> Tuple[User, Dict[str, str]]:
        """Authenticate with email/password and return JWT pair."""
        user = self.user_repo.get_by_email(email)
        if user is None or not user.check_password(password):
            raise ValueError("Invalid email or password.")
        jwt_tokens = self._issue_jwt(user)
        return user, jwt_tokens

    # ------------------------------------------------------------------
    # Private helpers
    # ------------------------------------------------------------------
    def _exchange_google_code(self, code: str, redirect_uri: str) -> Dict[str, Any]:
        response = requests.post(GOOGLE_TOKEN_URL, data={
            "code": code,
            "client_id": settings.GOOGLE_CLIENT_ID,
            "client_secret": settings.GOOGLE_CLIENT_SECRET,
            "redirect_uri": redirect_uri,
            "grant_type": "authorization_code",
        }, timeout=10)
        response.raise_for_status()
        return response.json()

    @staticmethod
    def _get_google_user_info(access_token: str) -> Dict[str, Any]:
        response = requests.get(
            GOOGLE_USERINFO_URL,
            headers={"Authorization": f"Bearer {access_token}"},
            timeout=10,
        )
        response.raise_for_status()
        return response.json()

    @staticmethod
    def _verify_google_id_token(id_token_str: str) -> Dict[str, Any]:
        """Verify Google ID token via Google's tokeninfo endpoint."""
        response = requests.get(
            f"https://oauth2.googleapis.com/tokeninfo?id_token={id_token_str}",
            timeout=10,
        )
        response.raise_for_status()
        data = response.json()
        return {
            "id": data.get("sub"),
            "email": data.get("email"),
            "given_name": data.get("given_name", ""),
            "family_name": data.get("family_name", ""),
            "picture": data.get("picture", ""),
        }

    def _get_or_create_user(self, google_info: Dict[str, Any]) -> User:
        google_id = google_info["id"]
        user = self.user_repo.get_by_google_id(google_id)
        if user:
            # Update avatar in case it changed
            if google_info.get("picture"):
                self.user_repo.update_user(user, avatar_url=google_info["picture"])
            return user

        return self.user_repo.create_google_user(
            google_id=google_id,
            email=google_info["email"],
            first_name=google_info.get("given_name", ""),
            last_name=google_info.get("family_name", ""),
            avatar_url=google_info.get("picture", ""),
        )

    @staticmethod
    def _issue_jwt(user: User) -> Dict[str, str]:
        refresh = RefreshToken.for_user(user)
        return {
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        }
