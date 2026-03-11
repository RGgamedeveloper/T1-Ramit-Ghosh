"""
API views for attempts.
"""
from rest_framework import status, generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.quizzes.models import Quiz
from .serializers import (
    AttemptSerializer, AttemptListSerializer,
    StartAttemptSerializer, SubmitAttemptSerializer,
)
from .services import AttemptService


class StartAttemptView(APIView):
    """Begin a new quiz attempt."""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = StartAttemptSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            quiz = Quiz.objects.get(id=serializer.validated_data["quiz_id"], is_published=True)
        except Quiz.DoesNotExist:
            return Response({"error": "Quiz not found"}, status=status.HTTP_404_NOT_FOUND)

        service = AttemptService()
        attempt = service.start_attempt(request.user, quiz)
        return Response(AttemptSerializer(attempt).data, status=status.HTTP_201_CREATED)


class SubmitAttemptView(APIView):
    """Submit answers for an in-progress attempt."""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        serializer = SubmitAttemptSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        service = AttemptService()
        attempt = service.get_attempt_detail(pk, user=request.user)

        if not attempt:
            return Response({"error": "Attempt not found"}, status=status.HTTP_404_NOT_FOUND)
        if attempt.status != "in_progress":
            return Response({"error": "Attempt already completed"}, status=status.HTTP_400_BAD_REQUEST)

        attempt = service.submit_attempt(
            attempt,
            serializer.validated_data["answers"],
            serializer.validated_data["time_taken"],
        )
        return Response(AttemptSerializer(attempt).data)


class AttemptDetailView(generics.RetrieveAPIView):
    """Get a specific attempt with answers."""
    serializer_class = AttemptSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.request.user.attempts.select_related("quiz", "quiz__category").prefetch_related(
            "answers__question", "answers__selected_choice"
        )


class AttemptHistoryView(generics.ListAPIView):
    """Paginated history of the user's quiz attempts."""
    serializer_class = AttemptListSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        service = AttemptService()
        quiz_id = self.request.query_params.get("quiz_id")
        return service.get_user_history(self.request.user, quiz_id=quiz_id)


class UserStatsView(APIView):
    """Aggregated stats for the current user."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        service = AttemptService()
        return Response(service.get_user_stats(request.user))
