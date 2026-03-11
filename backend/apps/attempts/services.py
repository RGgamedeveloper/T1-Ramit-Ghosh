"""
Service layer for attempts.
"""
from typing import Dict, Any, Optional, List

from apps.quizzes.models import Choice
from .models import Attempt
from .repositories import AttemptRepository


class AttemptService:
    """Business logic for quiz attempts."""

    def __init__(self):
        self.repo = AttemptRepository()

    def start_attempt(self, user, quiz) -> Attempt:
        return self.repo.create_attempt(user, quiz)

    def submit_attempt(
        self, attempt: Attempt, answers: List[Dict[str, int]], time_taken: int
    ) -> Attempt:
        """
        Grade and finalise an attempt.
        answers: [{"question_id": 1, "selected_choice_id": 5}, ...]
        """
        graded = []
        correct_count = 0

        for ans in answers:
            choice_id = ans.get("selected_choice_id")
            is_correct = False
            if choice_id:
                try:
                    choice = Choice.objects.get(id=choice_id)
                    is_correct = choice.is_correct
                except Choice.DoesNotExist:
                    pass

            if is_correct:
                correct_count += 1

            graded.append({
                "question_id": ans["question_id"],
                "selected_choice_id": choice_id,
                "is_correct": is_correct,
            })

        self.repo.save_answers(attempt, graded)
        return self.repo.complete_attempt(attempt, correct_count, time_taken)

    def get_attempt_detail(self, attempt_id: int, user=None) -> Optional[Attempt]:
        return self.repo.get_by_id(attempt_id, user=user)

    def get_user_history(self, user, quiz_id: Optional[int] = None):
        return self.repo.get_user_attempts(user, quiz_id=quiz_id)

    def get_user_stats(self, user) -> Dict[str, Any]:
        return self.repo.get_user_stats(user)
