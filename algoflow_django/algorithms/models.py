from django.db import models
import json


class Category(models.Model):
    name = models.CharField(max_length=200, unique=True)
    icon = models.CharField(max_length=100, default='Box')

    class Meta:
        verbose_name_plural = 'categories'
        ordering = ['name']

    def __str__(self):
        return self.name

    def algorithm_ids(self):
        return list(self.algorithms.values_list('algo_id', flat=True))


class Algorithm(models.Model):
    TIME_RATING_CHOICES = [
        ('good', 'Good'),
        ('average', 'Average'),
        ('bad', 'Bad'),
    ]

    # Core identity
    algo_id   = models.CharField(max_length=200, unique=True)   # the frontend "id" e.g. "bubble-sort"
    name      = models.CharField(max_length=200)
    category  = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, related_name='algorithms')
    icon      = models.CharField(max_length=100, default='Sparkles', blank=True)
    description = models.TextField(blank=True)

    # Complexity
    complexity_time         = models.CharField(max_length=50, default='O(n)')
    complexity_space        = models.CharField(max_length=50, default='O(1)')
    complexity_time_rating  = models.CharField(max_length=10, choices=TIME_RATING_CHOICES, default='average')
    complexity_space_rating = models.CharField(max_length=10, choices=TIME_RATING_CHOICES, default='good')

    # Code — stored as JSON text per language
    # Each language has: classCode, functionCode, recursiveCode, classOutcome, classRuntime, functionOutcome, functionRuntime, recursiveOutcome, recursiveRuntime
    code_python = models.JSONField(default=dict, blank=True)
    code_cpp    = models.JSONField(default=dict, blank=True)
    code_c      = models.JSONField(default=dict, blank=True)
    code_rust   = models.JSONField(default=dict, blank=True)

    # Explanation
    explanation_problem    = models.TextField(blank=True)
    explanation_intuition  = models.TextField(blank=True)
    explanation_walkthrough = models.TextField(blank=True)
    explanation_when_to_use = models.TextField(blank=True)
    explanation_fun_fact   = models.TextField(blank=True)
    explanation_research_links = models.JSONField(default=list, blank=True)  # [{title, url}]

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.name


class Asset(models.Model):
    ASSET_TYPE_CHOICES = [
        ('pdf',   'PDF'),
        ('text',  'Text'),
        ('image', 'Image'),
        ('video', 'Video'),
    ]

    algorithm  = models.ForeignKey(Algorithm, on_delete=models.CASCADE, related_name='assets')
    asset_id   = models.CharField(max_length=100)   # frontend-generated short id
    name       = models.CharField(max_length=255)
    asset_type = models.CharField(max_length=10, choices=ASSET_TYPE_CHOICES)
    data       = models.TextField()   # base64 or data-URI

    def __str__(self):
        return f"{self.algorithm.name} — {self.name}"


class Question(models.Model):
    LANGUAGE_CHOICES = [
        ('python', 'Python'),
        ('cpp',    'C++'),
        ('c',      'C'),
        ('rust',   'Rust'),
    ]

    algorithm   = models.ForeignKey(Algorithm, on_delete=models.CASCADE, related_name='questions')
    question_id = models.CharField(max_length=100)   # frontend-generated short id
    text        = models.TextField()
    answer      = models.TextField()
    language    = models.CharField(max_length=10, choices=LANGUAGE_CHOICES, default='python')
    explanation = models.TextField(blank=True)

    def __str__(self):
        return f"{self.algorithm.name} — Q{self.question_id}"
