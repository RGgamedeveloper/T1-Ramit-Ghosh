"""
API views for authentication.
"""
from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenRefreshView as BaseTokenRefreshView

from .serializers import UserSerializer, GoogleLoginSerializer, RegisterSerializer, LoginSerializer
from .services import AuthService


class GoogleLoginView(APIView):
    """Exchange Google auth code or ID token for a JWT pair."""
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def post(self, request):
        serializer = GoogleLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        auth_service = AuthService()

        try:
            if serializer.validated_data.get("credential"):
                user, tokens = auth_service.google_authenticate_with_token(
                    serializer.validated_data["credential"]
                )
            else:
                user, tokens = auth_service.google_authenticate(
                    serializer.validated_data["code"],
                    serializer.validated_data.get("redirect_uri", "postmessage"),
                )
        except Exception as e:
            return Response(
                {"error": "Authentication failed", "detail": str(e)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response({
            "user": UserSerializer(user).data,
            "tokens": tokens,
        }, status=status.HTTP_200_OK)


class RegisterView(APIView):
    """Register a new user with email and password."""
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        auth_service = AuthService()
        try:
            user, tokens = auth_service.register_user(
                email=serializer.validated_data["email"],
                username=serializer.validated_data["username"],
                password=serializer.validated_data["password"],
            )
        except Exception as e:
            return Response(
                {"error": "Registration failed", "detail": str(e)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response({
            "user": UserSerializer(user).data,
            "tokens": tokens,
        }, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    """Authenticate with email and password."""
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        auth_service = AuthService()
        try:
            user, tokens = auth_service.login_user(
                email=serializer.validated_data["email"],
                password=serializer.validated_data["password"],
            )
        except ValueError as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        return Response({
            "user": UserSerializer(user).data,
            "tokens": tokens,
        }, status=status.HTTP_200_OK)


class TokenRefreshView(BaseTokenRefreshView):
    """Refresh an access token (proxy to simplejwt)."""
    pass


class UserProfileView(APIView):
    """Get or update the authenticated user's profile."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)

    def patch(self, request):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
