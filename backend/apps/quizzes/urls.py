from django.urls import path
from . import views

app_name = "quizzes"

urlpatterns = [
    path("", views.QuizListView.as_view(), name="quiz-list"),
    path("create/", views.QuizCreateView.as_view(), name="quiz-create"),
    path("categories/", views.CategoryListView.as_view(), name="category-list"),
    path("<int:pk>/", views.QuizDetailView.as_view(), name="quiz-detail"),
]
