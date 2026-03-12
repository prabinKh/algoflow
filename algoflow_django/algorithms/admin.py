from django.contrib import admin
from .models import Algorithm, Category, Asset, Question


class AssetInline(admin.TabularInline):
    model  = Asset
    extra  = 0
    fields = ['asset_id', 'name', 'asset_type']
    readonly_fields = ['asset_id']


class QuestionInline(admin.TabularInline):
    model  = Question
    extra  = 0
    fields = ['question_id', 'text', 'language']
    readonly_fields = ['question_id']


@admin.register(Algorithm)
class AlgorithmAdmin(admin.ModelAdmin):
    list_display  = ['name', 'algo_id', 'category', 'complexity_time', 'complexity_space', 'created_at']
    list_filter   = ['category', 'complexity_time_rating', 'complexity_space_rating']
    search_fields = ['name', 'algo_id', 'description']
    readonly_fields = ['created_at', 'updated_at']
    inlines = [AssetInline, QuestionInline]

    fieldsets = (
        ('Identity', {
            'fields': ('algo_id', 'name', 'category', 'icon', 'description')
        }),
        ('Complexity', {
            'fields': (
                ('complexity_time', 'complexity_time_rating'),
                ('complexity_space', 'complexity_space_rating'),
            )
        }),
        ('Code', {
            'classes': ('collapse',),
            'fields': ('code_python', 'code_cpp', 'code_c', 'code_rust')
        }),
        ('Explanation', {
            'classes': ('collapse',),
            'fields': (
                'explanation_problem',
                'explanation_intuition',
                'explanation_walkthrough',
                'explanation_when_to_use',
                'explanation_fun_fact',
                'explanation_research_links',
            )
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display  = ['name', 'icon']
    search_fields = ['name']


@admin.register(Asset)
class AssetAdmin(admin.ModelAdmin):
    list_display  = ['name', 'asset_type', 'algorithm']
    list_filter   = ['asset_type']
    search_fields = ['name', 'algorithm__name']


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display  = ['algorithm', 'language', 'text']
    list_filter   = ['language']
    search_fields = ['text', 'algorithm__name']
