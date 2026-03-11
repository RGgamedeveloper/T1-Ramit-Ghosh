"""
Quiz domain models.
"""
from django.db import models
from django.conf import settings


class Category(models.Model):
    """Quiz category / topic."""
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True)
    icon = models.CharField(max_length=50, blank=True, default="📚", help_text="Emoji or icon class")
    color = models.CharField(max_length=7, default="#6366f1", help_text="Hex colour for UI badge")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "quizzes_category"
        verbose_name_plural = "Categories"
        ordering = ["name"]

    def __str__(self):
        return self.name


class Quiz(models.Model):
    """A quiz containing multiple questions."""
    class Difficulty(models.TextChoices):
        EASY = "easy", "Easy"
        MEDIUM = "medium", "Medium"
        HARD = "hard", "Hard"

    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, default="")
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name="quizzes")
    difficulty = models.CharField(max_length=10, choices=Difficulty.choices, default=Difficulty.MEDIUM)
    time_limit_seconds = models.PositiveIntegerField(default=600, help_text="Total allowed time in seconds")
    is_published = models.BooleanField(default=False)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name="created_quizzes"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "quizzes_quiz"
        verbose_name_plural = "Quizzes"
        ordering = ["-created_at"]

    def __str__(self):
        return self.title

    @property
    def question_count(self):
        return self.questions.count()


class Question(models.Model):
    """A single question in a quiz."""
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name="questions")
    text = models.TextField()
    explanation = models.TextField(blank=True, default="", help_text="Shown after answer")
    order = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = "quizzes_question"
        ordering = ["order"]

    def __str__(self):
        return f"Q{self.order}: {self.text[:60]}"


class Choice(models.Model):
    """An answer choice for a question (one must be correct)."""
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name="choices")
    text = models.CharField(max_length=500)
    is_correct = models.BooleanField(default=False)

    class Meta:
        db_table = "quizzes_choice"

    def __str__(self):
        return f"{'✓' if self.is_correct else '✗'} {self.text[:60]}"
