"""
Serializers for the accounts domain.
"""
from rest_framework import serializers
from .models import User


class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.ReadOnlyField()
    is_admin = serializers.BooleanField(source="is_staff", read_only=True)

    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "username",
            "first_name",
            "last_name",
            "full_name",
            "avatar_url",
            "bio",
            "date_joined",
            "is_admin",
        ]
        read_only_fields = ["id", "email", "username", "date_joined", "is_admin"]


class GoogleLoginSerializer(serializers.Serializer):
    code = serializers.CharField(required=False, help_text="Google authorization code")
    credential = serializers.CharField(required=False, help_text="Google ID token from One Tap")
    redirect_uri = serializers.URLField(required=False, default="postmessage")

    def validate(self, attrs):
        if not attrs.get("code") and not attrs.get("credential"):
            raise serializers.ValidationError("Either 'code' or 'credential' is required.")
        return attrs


class RegisterSerializer(serializers.Serializer):
    email = serializers.EmailField()
    username = serializers.CharField(min_length=3, max_length=30)
    password = serializers.CharField(min_length=8, write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("An account with this email already exists.")
        return value

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("This username is already taken.")
        return value

    def validate(self, attrs):
        if attrs["password"] != attrs["confirm_password"]:
            raise serializers.ValidationError({"confirm_password": "Passwords do not match."})
        return attrs


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
