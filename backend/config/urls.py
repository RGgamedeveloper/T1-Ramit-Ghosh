"""
Root URL configuration for Quiz Portal.
"""
from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse


def api_root(request):
    return JsonResponse({
        "name": "Quiz Portal API",
        "version": "1.0.0",
        "endpoints": {
            "auth": "/api/auth/",
            "quizzes": "/api/quizzes/",
            "attempts": "/api/attempts/",
        },
    })


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", api_root, name="api-root"),
    path("api/auth/", include("apps.accounts.urls")),
    path("api/quizzes/", include("apps.quizzes.urls")),
    path("api/attempts/", include("apps.attempts.urls")),
]
