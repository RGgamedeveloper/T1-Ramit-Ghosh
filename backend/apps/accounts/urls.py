from django.urls import path
from . import views

app_name = "accounts"

urlpatterns = [
    path("register/", views.RegisterView.as_view(), name="register"),
    path("login/", views.LoginView.as_view(), name="login"),
    path("google/login/", views.GoogleLoginView.as_view(), name="google-login"),
    path("token/refresh/", views.TokenRefreshView.as_view(), name="token-refresh"),
    path("profile/", views.UserProfileView.as_view(), name="user-profile"),
]
