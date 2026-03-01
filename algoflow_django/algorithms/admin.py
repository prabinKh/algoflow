from django.contrib import admin
from django.utils.html import format_html
from .models import Algorithm, Category


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'icon', 'algorithm_count']
    search_fields = ['name']
    ordering = ['name']
    
    def algorithm_count(self, obj):
        return obj.algorithms.count()
    algorithm_count.short_description = 'Algorithms'


@admin.register(Algorithm)
class AlgorithmAdmin(admin.ModelAdmin):
    list_display = [
        'name', 
        'category', 
        'icon',
        'complexity_time', 
        'complexity_space', 
        'time_rating_display',
        'space_rating_display',
        'created_at',
        'updated_at'
    ]
    list_filter = [
        'category', 
        'complexity_time_rating', 
        'complexity_space_rating',
        'created_at'
    ]
    search_fields = ['name', 'description', 'id']
    readonly_fields = ['created_at', 'updated_at']
    ordering = ['-created_at']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('id', 'name', 'category', 'icon', 'description')
        }),
        ('Complexity', {
            'fields': (
                ('complexity_time', 'complexity_time_rating'),
                ('complexity_space', 'complexity_space_rating')
            )
        }),
        ('Code Implementation', {
            'fields': ('code',),
            'classes': ('collapse',)
        }),
        ('Explanation', {
            'fields': ('explanation',),
            'classes': ('collapse',)
        }),
        ('Assets', {
            'fields': ('assets',),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def time_rating_display(self, obj):
        colors = {
            'good': 'green',
            'average': 'orange',
            'bad': 'red'
        }
        return format_html(
            '<span style="color: {};">{}</span>',
            colors.get(obj.complexity_time_rating, 'black'),
            obj.get_complexity_time_rating_display()
        )
    time_rating_display.short_description = 'Time Rating'
    
    def space_rating_display(self, obj):
        colors = {
            'good': 'green',
            'average': 'orange',
            'bad': 'red'
        }
        return format_html(
            '<span style="color: {};">{}</span>',
            colors.get(obj.complexity_space_rating, 'black'),
            obj.get_complexity_space_rating_display()
        )
    space_rating_display.short_description = 'Space Rating'
