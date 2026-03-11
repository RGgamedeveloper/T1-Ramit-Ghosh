"""
Attempt domain models.
"""
from django.db import models
from django.conf import settings


class Attempt(models.Model):
    """A user's attempt at a quiz."""
    class Status(models.TextChoices):
        IN_PROGRESS = "in_progress", "In Progress"
        COMPLETED = "completed", "Completed"
        TIMED_OUT = "timed_out", "Timed Out"

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="attempts")
    quiz = models.ForeignKey("quizzes.Quiz", on_delete=models.CASCADE, related_name="attempts")
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.IN_PROGRESS)
    score = models.PositiveIntegerField(default=0)
    total_questions = models.PositiveIntegerField(default=0)
    percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    time_taken_seconds = models.PositiveIntegerField(default=0)
    started_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "attempts_attempt"
        ordering = ["-started_at"]

    def __str__(self):
        return f"{self.user} → {self.quiz} ({self.percentage}%)"


class AttemptAnswer(models.Model):
    """A user's answer to a specific question within an attempt."""
    attempt = models.ForeignKey(Attempt, on_delete=models.CASCADE, related_name="answers")
    question = models.ForeignKey("quizzes.Question", on_delete=models.CASCADE)
    selected_choice = models.ForeignKey("quizzes.Choice", on_delete=models.CASCADE, null=True, blank=True)
    is_correct = models.BooleanField(default=False)

    class Meta:
        db_table = "attempts_answer"
        unique_together = ("attempt", "question")

    def __str__(self):
        return f"{'✓' if self.is_correct else '✗'} Q{self.question.order}"
