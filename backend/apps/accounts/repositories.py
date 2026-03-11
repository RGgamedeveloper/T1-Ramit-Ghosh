"""
Repository layer — encapsulates all database access for the accounts domain.
"""
from typing import Optional
from .models import User


class UserRepository:
    """Data-access object for User model."""

    @staticmethod
    def get_by_google_id(google_id: str) -> Optional[User]:
        return User.objects.filter(google_id=google_id).first()

    @staticmethod
    def get_by_email(email: str) -> Optional[User]:
        return User.objects.filter(email=email).first()

    @staticmethod
    def get_by_id(user_id: int) -> Optional[User]:
        return User.objects.filter(id=user_id).first()

    @staticmethod
    def create_google_user(
        google_id: str,
        email: str,
        first_name: str = "",
        last_name: str = "",
        avatar_url: str = "",
    ) -> User:
        username = email.split("@")[0]
        # Ensure unique username
        base = username
        counter = 1
        while User.objects.filter(username=username).exists():
            username = f"{base}{counter}"
            counter += 1

        return User.objects.create(
            google_id=google_id,
            email=email,
            username=username,
            first_name=first_name,
            last_name=last_name,
            avatar_url=avatar_url,
        )

    @staticmethod
    def create_email_user(email: str, username: str, password: str) -> User:
        """Create a user with email/password credentials."""
        return User.objects.create_user(
            username=username,
            email=email,
            password=password,
        )

    @staticmethod
    def update_user(user: User, **kwargs) -> User:
        for key, value in kwargs.items():
            if hasattr(user, key):
                setattr(user, key, value)
        user.save()
        return user
