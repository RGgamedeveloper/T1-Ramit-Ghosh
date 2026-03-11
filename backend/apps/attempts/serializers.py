"""
Serializers for attempts domain.
"""
from rest_framework import serializers
from .models import Attempt, AttemptAnswer


class AttemptAnswerSerializer(serializers.ModelSerializer):
    question_text = serializers.CharField(source="question.text", read_only=True)
    selected_choice_text = serializers.CharField(
        source="selected_choice.text", read_only=True, default=""
    )

    class Meta:
        model = AttemptAnswer
        fields = ["id", "question_id", "question_text", "selected_choice_id",
                  "selected_choice_text", "is_correct"]


class AttemptSerializer(serializers.ModelSerializer):
    quiz_title = serializers.CharField(source="quiz.title", read_only=True)
    category_name = serializers.CharField(source="quiz.category.name", read_only=True, default="")
    answers = AttemptAnswerSerializer(many=True, read_only=True)

    class Meta:
        model = Attempt
        fields = [
            "id", "quiz_id", "quiz_title", "category_name", "status",
            "score", "total_questions", "percentage", "time_taken_seconds",
            "started_at", "completed_at", "answers",
        ]


class AttemptListSerializer(serializers.ModelSerializer):
    quiz_title = serializers.CharField(source="quiz.title", read_only=True)
    category_name = serializers.CharField(source="quiz.category.name", read_only=True, default="")

    class Meta:
        model = Attempt
        fields = [
            "id", "quiz_id", "quiz_title", "category_name", "status",
            "score", "total_questions", "percentage", "time_taken_seconds",
            "started_at", "completed_at",
        ]


class SubmitAnswerSerializer(serializers.Serializer):
    question_id = serializers.IntegerField()
    selected_choice_id = serializers.IntegerField(required=False, allow_null=True)


class SubmitAttemptSerializer(serializers.Serializer):
    answers = SubmitAnswerSerializer(many=True)
    time_taken = serializers.IntegerField(help_text="Time taken in seconds")


class StartAttemptSerializer(serializers.Serializer):
    quiz_id = serializers.IntegerField()
