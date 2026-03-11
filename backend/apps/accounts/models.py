"""
Custom User model with Google OAuth fields.
"""
from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """Extended user model for Quiz Portal."""
    google_id = models.CharField(max_length=255, unique=True, null=True, blank=True)
    avatar_url = models.URLField(max_length=500, blank=True, default="")
    bio = models.TextField(max_length=500, blank=True, default="")
    date_joined = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "accounts_user"
        ordering = ["-date_joined"]

    def __str__(self):
        return self.email or self.username

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}".strip() or self.username
