"""
Repository layer for the quizzes domain.
"""
from typing import Optional, List
from django.db.models import QuerySet, Count
from django.utils.text import slugify

from .models import Quiz, Category, Question, Choice


class QuizRepository:
    """Data-access object for Quiz and related models."""

    @staticmethod
    def list_published(category_slug: Optional[str] = None, difficulty: Optional[str] = None) -> QuerySet:
        qs = Quiz.objects.filter(is_published=True).select_related("category", "created_by")
        if category_slug:
            qs = qs.filter(category__slug=category_slug)
        if difficulty:
            qs = qs.filter(difficulty=difficulty)
        return qs.annotate(num_questions=Count("questions"))

    @staticmethod
    def get_by_id(quiz_id: int) -> Optional[Quiz]:
        return (
            Quiz.objects.filter(id=quiz_id)
            .select_related("category", "created_by")
            .prefetch_related("questions__choices")
            .first()
        )

    @staticmethod
    def get_questions_with_choices(quiz_id: int) -> QuerySet:
        return Question.objects.filter(quiz_id=quiz_id).prefetch_related("choices").order_by("order")

    @staticmethod
    def list_categories() -> QuerySet:
        return Category.objects.annotate(quiz_count=Count("quizzes")).order_by("name")

    # ------------------------------------------------------------------
    # Admin — creation helpers
    # ------------------------------------------------------------------
    @staticmethod
    def get_or_create_category(name: str) -> Category:
        slug = slugify(name)
        category, _ = Category.objects.get_or_create(
            slug=slug,
            defaults={"name": name, "slug": slug},
        )
        return category

    @staticmethod
    def create_quiz(title, description, category, difficulty, time_limit_seconds, is_published, created_by) -> Quiz:
        return Quiz.objects.create(
            title=title,
            description=description,
            category=category,
            difficulty=difficulty,
            time_limit_seconds=time_limit_seconds,
            is_published=is_published,
            created_by=created_by,
        )

    @staticmethod
    def create_question(quiz: Quiz, text: str, explanation: str, order: int) -> Question:
        return Question.objects.create(quiz=quiz, text=text, explanation=explanation, order=order)

    @staticmethod
    def create_choice(question: Question, text: str, is_correct: bool) -> Choice:
        return Choice.objects.create(question=question, text=text, is_correct=is_correct)


class CategoryRepository:
    @staticmethod
    def get_by_slug(slug: str) -> Optional[Category]:
        return Category.objects.filter(slug=slug).first()
