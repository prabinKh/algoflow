from django.db import models
import json


class Category(models.Model):
    """Algorithm category model."""
    name = models.CharField(max_length=100, primary_key=True)
    icon = models.CharField(max_length=50, default='Box')

    class Meta:
        verbose_name_plural = 'Categories'
        ordering = ['name']

    def __str__(self):
        return self.name


class Algorithm(models.Model):
    """Algorithm model with JSON fields for complex data."""
    RATING_CHOICES = [
        ('good', 'Good'),
        ('average', 'Average'),
        ('bad', 'Bad'),
    ]

    id = models.CharField(max_length=100, primary_key=True)
    name = models.CharField(max_length=200)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='algorithms')
    description = models.TextField()
    icon = models.CharField(max_length=50, blank=True, null=True)
    
    # Complexity stored as JSON
    complexity_time = models.CharField(max_length=50, default='O(n)')
    complexity_space = models.CharField(max_length=50, default='O(1)')
    complexity_time_rating = models.CharField(max_length=10, choices=RATING_CHOICES, default='average')
    complexity_space_rating = models.CharField(max_length=10, choices=RATING_CHOICES, default='good')
    
    # Code stored as JSON string
    code = models.JSONField(default=dict)
    
    # Explanation stored as JSON
    explanation = models.JSONField(default=dict)
    
    # Assets stored as JSON
    assets = models.JSONField(default=list)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name

    @property
    def complexity(self):
        """Return complexity as dict matching original API format."""
        return {
            'time': self.complexity_time,
            'space': self.complexity_space,
            'timeRating': self.complexity_time_rating,
            'spaceRating': self.complexity_space_rating,
        }

    def to_dict(self):
        """Convert to dictionary matching original API response."""
        return {
            'id': self.id,
            'name': self.name,
            'category': self.category.name,
            'description': self.description,
            'icon': self.icon,
            'complexity': self.complexity,
            'code': self.code,
            'explanation': self.explanation,
            'assets': self.assets,
        }
