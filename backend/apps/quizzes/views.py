"""
API views for quizzes.
"""
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import QuizListSerializer, QuizDetailSerializer, CategorySerializer, QuizCreateSerializer
from .services import QuizService


class QuizListView(generics.ListAPIView):
    """Paginated list of published quizzes with optional filters."""
    serializer_class = QuizListSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        service = QuizService()
        return service.list_quizzes(
            category_slug=self.request.query_params.get("category"),
            difficulty=self.request.query_params.get("difficulty"),
        )


class QuizDetailView(generics.RetrieveAPIView):
    """Full quiz detail including questions and choices."""
    serializer_class = QuizDetailSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        service = QuizService()
        quiz = service.get_quiz_detail(self.kwargs["pk"])
        if quiz is None:
            from rest_framework.exceptions import NotFound
            raise NotFound("Quiz not found.")
        return quiz


class CategoryListView(generics.ListAPIView):
    """List all categories with quiz counts."""
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = None

    def get_queryset(self):
        service = QuizService()
        return service.get_categories()


class QuizCreateView(APIView):
    """Create a new quiz with questions and choices (admin only)."""
    permission_classes = [permissions.IsAdminUser]

    def post(self, request):
        serializer = QuizCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        service = QuizService()
        try:
            quiz = service.create_full_quiz(serializer.validated_data, request.user)
        except Exception as e:
            return Response(
                {"error": "Failed to create quiz", "detail": str(e)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            {"id": quiz.id, "title": quiz.title, "message": "Quiz created successfully."},
            status=status.HTTP_201_CREATED,
        )
