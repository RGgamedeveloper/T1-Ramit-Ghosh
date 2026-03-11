"""
Serializers for the quizzes domain.
"""
from rest_framework import serializers
from .models import Category, Quiz, Question, Choice


class ChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Choice
        fields = ["id", "text", "is_correct"]

    def to_representation(self, instance):
        """Hide is_correct when serving a quiz for attempt (not review)."""
        data = super().to_representation(instance)
        request = self.context.get("request")
        if request and request.query_params.get("mode") != "review":
            data.pop("is_correct", None)
        return data


class QuestionSerializer(serializers.ModelSerializer):
    choices = ChoiceSerializer(many=True, read_only=True)

    class Meta:
        model = Question
        fields = ["id", "text", "explanation", "order", "choices"]

    def to_representation(self, instance):
        data = super().to_representation(instance)
        request = self.context.get("request")
        if request and request.query_params.get("mode") != "review":
            data.pop("explanation", None)
        return data


class CategorySerializer(serializers.ModelSerializer):
    quiz_count = serializers.IntegerField(read_only=True, default=0)

    class Meta:
        model = Category
        fields = ["id", "name", "slug", "icon", "color", "quiz_count"]


class QuizListSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    question_count = serializers.IntegerField(source="num_questions", read_only=True)
    created_by_name = serializers.CharField(source="created_by.full_name", read_only=True, default="")

    class Meta:
        model = Quiz
        fields = [
            "id", "title", "description", "category", "difficulty",
            "time_limit_seconds", "question_count", "created_by_name",
            "created_at",
        ]


class QuizDetailSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    questions = QuestionSerializer(many=True, read_only=True)
    question_count = serializers.ReadOnlyField()

    class Meta:
        model = Quiz
        fields = [
            "id", "title", "description", "category", "difficulty",
            "time_limit_seconds", "question_count", "questions",
            "created_at",
        ]


# ------------------------------------------------------------------
# Admin — Quiz Creation
# ------------------------------------------------------------------
class ChoiceCreateSerializer(serializers.Serializer):
    text = serializers.CharField(max_length=500)
    is_correct = serializers.BooleanField(default=False)


class QuestionCreateSerializer(serializers.Serializer):
    text = serializers.CharField()
    explanation = serializers.CharField(required=False, default="", allow_blank=True)
    choices = ChoiceCreateSerializer(many=True)

    def validate_choices(self, value):
        if len(value) < 2:
            raise serializers.ValidationError("Each question must have at least 2 choices.")
        correct_count = sum(1 for c in value if c.get("is_correct"))
        if correct_count != 1:
            raise serializers.ValidationError("Each question must have exactly 1 correct choice.")
        return value


class QuizCreateSerializer(serializers.Serializer):
    title = serializers.CharField(max_length=255)
    description = serializers.CharField(required=False, default="", allow_blank=True)
    category_name = serializers.CharField(max_length=100, help_text="Category name (created if new)")
    difficulty = serializers.ChoiceField(choices=["easy", "medium", "hard"], default="medium")
    time_limit_seconds = serializers.IntegerField(default=600, min_value=30, max_value=7200)
    is_published = serializers.BooleanField(default=True)
    questions = QuestionCreateSerializer(many=True)

    def validate_questions(self, value):
        if len(value) < 1:
            raise serializers.ValidationError("A quiz must have at least 1 question.")
        return value
