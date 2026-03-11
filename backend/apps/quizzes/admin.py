from django.contrib import admin
from .models import Category, Quiz, Question, Choice


class ChoiceInline(admin.TabularInline):
    model = Choice
    extra = 4


class QuestionInline(admin.StackedInline):
    model = Question
    extra = 1
    show_change_link = True


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ["name", "slug", "icon", "color"]
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Quiz)
class QuizAdmin(admin.ModelAdmin):
    list_display = ["title", "category", "difficulty", "is_published", "created_at"]
    list_filter = ["difficulty", "is_published", "category"]
    search_fields = ["title"]
    inlines = [QuestionInline]


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ["quiz", "order", "text"]
    list_filter = ["quiz"]
    inlines = [ChoiceInline]
