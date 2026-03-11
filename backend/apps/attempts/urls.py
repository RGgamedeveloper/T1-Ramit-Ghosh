from django.urls import path
from . import views

app_name = "attempts"

urlpatterns = [
    path("start/", views.StartAttemptView.as_view(), name="start-attempt"),
    path("<int:pk>/submit/", views.SubmitAttemptView.as_view(), name="submit-attempt"),
    path("<int:pk>/", views.AttemptDetailView.as_view(), name="attempt-detail"),
    path("history/", views.AttemptHistoryView.as_view(), name="attempt-history"),
    path("stats/", views.UserStatsView.as_view(), name="user-stats"),
]
