"""
Repository layer for the attempts domain.
"""
from typing import Optional, Dict, Any
from django.db.models import QuerySet, Avg, Count, Sum, F
from django.utils import timezone

from .models import Attempt, AttemptAnswer


class AttemptRepository:
    """Data-access for Attempt and AttemptAnswer."""

    @staticmethod
    def create_attempt(user, quiz) -> Attempt:
        return Attempt.objects.create(
            user=user,
            quiz=quiz,
            total_questions=quiz.questions.count(),
        )

    @staticmethod
    def get_by_id(attempt_id: int, user=None) -> Optional[Attempt]:
        qs = Attempt.objects.select_related("quiz", "quiz__category")
        if user:
            qs = qs.filter(user=user)
        return qs.filter(id=attempt_id).first()

    @staticmethod
    def get_user_attempts(user, quiz_id: Optional[int] = None) -> QuerySet:
        qs = Attempt.objects.filter(user=user).select_related("quiz", "quiz__category")
        if quiz_id:
            qs = qs.filter(quiz_id=quiz_id)
        return qs

    @staticmethod
    def save_answers(attempt: Attempt, answers_data: list) -> list:
        answer_objects = []
        for ans in answers_data:
            obj = AttemptAnswer.objects.create(
                attempt=attempt,
                question_id=ans["question_id"],
                selected_choice_id=ans.get("selected_choice_id"),
                is_correct=ans.get("is_correct", False),
            )
            answer_objects.append(obj)
        return answer_objects

    @staticmethod
    def complete_attempt(attempt: Attempt, score: int, time_taken: int) -> Attempt:
        attempt.score = score
        attempt.percentage = round((score / attempt.total_questions) * 100, 2) if attempt.total_questions else 0
        attempt.time_taken_seconds = time_taken
        attempt.status = Attempt.Status.COMPLETED
        attempt.completed_at = timezone.now()
        attempt.save()
        return attempt

    @staticmethod
    def get_user_stats(user) -> Dict[str, Any]:
        attempts = Attempt.objects.filter(user=user, status=Attempt.Status.COMPLETED)
        stats = attempts.aggregate(
            total_attempts=Count("id"),
            avg_score=Avg("percentage"),
            total_correct=Sum("score"),
            total_questions=Sum("total_questions"),
        )
        # Recent scores for chart
        recent = list(
            attempts.order_by("-completed_at")[:10]
            .values("quiz__title", "percentage", "completed_at")
        )
        return {
            "total_attempts": stats["total_attempts"] or 0,
            "avg_score": round(stats["avg_score"] or 0, 1),
            "total_correct": stats["total_correct"] or 0,
            "total_questions": stats["total_questions"] or 0,
            "accuracy": round(
                ((stats["total_correct"] or 0) / (stats["total_questions"] or 1)) * 100, 1
            ),
            "recent_scores": list(reversed(recent)),
        }
