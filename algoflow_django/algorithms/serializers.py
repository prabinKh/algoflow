from rest_framework import serializers
from .models import Algorithm, Category
import json


class CategorySerializer(serializers.ModelSerializer):
    """Serializer for Category model."""
    
    class Meta:
        model = Category
        fields = ['name', 'icon']


class AlgorithmSerializer(serializers.ModelSerializer):
    """Serializer for Algorithm model with nested JSON fields."""
    category = serializers.CharField(source='category.name')
    complexity = serializers.SerializerMethodField()
    
    class Meta:
        model = Algorithm
        fields = [
            'id', 'name', 'category', 'description', 'icon',
            'complexity', 'code', 'explanation', 'assets'
        ]
    
    def get_complexity(self, obj):
        return obj.complexity
    
    def validate_code(self, value):
        """Ensure code is a valid dict with required languages."""
        if not isinstance(value, dict):
            raise serializers.ValidationError("Code must be a JSON object")
        
        required_langs = ['python', 'cpp', 'c', 'rust']
        for lang in required_langs:
            if lang not in value:
                value[lang] = {'iterative': ''}
        return value
    
    def validate_explanation(self, value):
        """Ensure explanation has required fields."""
        if not isinstance(value, dict):
            raise serializers.ValidationError("Explanation must be a JSON object")
        
        required_fields = ['problem', 'intuition', 'walkthrough', 'whenToUse']
        for field in required_fields:
            if field not in value:
                value[field] = ''
        return value
    
    def create(self, validated_data):
        category_name = validated_data.pop('category')['name']
        category, _ = Category.objects.get_or_create(name=category_name)
        
        # Extract complexity fields
        complexity_data = validated_data.pop('complexity', {})
        
        algorithm = Algorithm.objects.create(
            category=category,
            complexity_time=complexity_data.get('time', 'O(n)'),
            complexity_space=complexity_data.get('space', 'O(1)'),
            complexity_time_rating=complexity_data.get('timeRating', 'average'),
            complexity_space_rating=complexity_data.get('spaceRating', 'good'),
            **validated_data
        )
        return algorithm
    
    def update(self, instance, validated_data):
        if 'category' in validated_data:
            category_name = validated_data.pop('category')['name']
            category, _ = Category.objects.get_or_create(name=category_name)
            instance.category = category
        
        # Update complexity if provided
        complexity_data = validated_data.pop('complexity', None)
        if complexity_data:
            instance.complexity_time = complexity_data.get('time', instance.complexity_time)
            instance.complexity_space = complexity_data.get('space', instance.complexity_space)
            instance.complexity_time_rating = complexity_data.get('timeRating', instance.complexity_time_rating)
            instance.complexity_space_rating = complexity_data.get('spaceRating', instance.complexity_space_rating)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        instance.save()
        return instance


class AlgorithmImportSerializer(serializers.Serializer):
    """Serializer for bulk importing algorithms."""
    algorithms = AlgorithmSerializer(many=True)
    
    def create(self, validated_data):
        algorithms_data = validated_data.get('algorithms', [])
        created = []
        
        for algo_data in algorithms_data:
            category_name = algo_data.pop('category')['name']
            category, _ = Category.objects.get_or_create(name=category_name)
            
            complexity_data = algo_data.pop('complexity', {})
            
            algorithm, _ = Algorithm.objects.update_or_create(
                id=algo_data.get('id'),
                defaults={
                    'category': category,
                    'complexity_time': complexity_data.get('time', 'O(n)'),
                    'complexity_space': complexity_data.get('space', 'O(1)'),
                    'complexity_time_rating': complexity_data.get('timeRating', 'average'),
                    'complexity_space_rating': complexity_data.get('spaceRating', 'good'),
                    **algo_data
                }
            )
            created.append(algorithm)
        
        return created
