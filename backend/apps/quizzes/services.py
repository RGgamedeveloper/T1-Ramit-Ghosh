"""
Service layer for quizzes.
"""
from typing import Optional, Dict, Any, List
from django.db import transaction
from django.db.models import QuerySet

from .repositories import QuizRepository, CategoryRepository
from .models import Quiz


class QuizService:
    """Business logic for quiz browsing and creation."""

    def __init__(self):
        self.quiz_repo = QuizRepository()
        self.category_repo = CategoryRepository()

    def list_quizzes(
        self,
        category_slug: Optional[str] = None,
        difficulty: Optional[str] = None,
    ) -> QuerySet:
        return self.quiz_repo.list_published(
            category_slug=category_slug,
            difficulty=difficulty,
        )

    def get_quiz_detail(self, quiz_id: int) -> Optional[Quiz]:
        quiz = self.quiz_repo.get_by_id(quiz_id)
        if quiz and not quiz.is_published:
            return None
        return quiz

    def get_categories(self) -> QuerySet:
        return self.quiz_repo.list_categories()

    @transaction.atomic
    def create_full_quiz(self, data: Dict[str, Any], user) -> Quiz:
        """
        Create a quiz with all its questions and choices in one transaction.
        """
        # Get or create category
        category = self.quiz_repo.get_or_create_category(data["category_name"])

        # Create quiz
        quiz = self.quiz_repo.create_quiz(
            title=data["title"],
            description=data.get("description", ""),
            category=category,
            difficulty=data.get("difficulty", "medium"),
            time_limit_seconds=data.get("time_limit_seconds", 600),
            is_published=data.get("is_published", True),
            created_by=user,
        )

        # Create questions and choices
        for order, q_data in enumerate(data["questions"], start=1):
            question = self.quiz_repo.create_question(
                quiz=quiz,
                text=q_data["text"],
                explanation=q_data.get("explanation", ""),
                order=order,
            )
            for c_data in q_data["choices"]:
                self.quiz_repo.create_choice(
                    question=question,
                    text=c_data["text"],
                    is_correct=c_data.get("is_correct", False),
                )

        return quiz
