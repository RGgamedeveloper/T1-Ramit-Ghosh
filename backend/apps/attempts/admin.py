from django.contrib import admin
from .models import Attempt, AttemptAnswer


class AttemptAnswerInline(admin.TabularInline):
    model = AttemptAnswer
    extra = 0
    readonly_fields = ["question", "selected_choice", "is_correct"]


@admin.register(Attempt)
class AttemptAdmin(admin.ModelAdmin):
    list_display = ["user", "quiz", "status", "score", "total_questions", "percentage", "started_at"]
    list_filter = ["status"]
    search_fields = ["user__username", "quiz__title"]
    inlines = [AttemptAnswerInline]
