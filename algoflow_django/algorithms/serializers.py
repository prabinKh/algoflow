from rest_framework import serializers
from .models import Category, Algorithm, Asset, Question


# ─────────────────────────────────────────────
#  Asset
# ─────────────────────────────────────────────
class AssetSerializer(serializers.ModelSerializer):
    id   = serializers.CharField(source='asset_id')
    type = serializers.CharField(source='asset_type')

    class Meta:
        model  = Asset
        fields = ['id', 'name', 'type', 'data']


# ─────────────────────────────────────────────
#  Question
# ─────────────────────────────────────────────
class QuestionSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source='question_id')

    class Meta:
        model  = Question
        fields = ['id', 'text', 'answer', 'language', 'explanation']


# ─────────────────────────────────────────────
#  Category
# ─────────────────────────────────────────────
class CategorySerializer(serializers.ModelSerializer):
    algorithms = serializers.SerializerMethodField()

    class Meta:
        model  = Category
        fields = ['name', 'icon', 'algorithms']

    def get_algorithms(self, obj):
        return list(obj.algorithms.values_list('algo_id', flat=True))


# ─────────────────────────────────────────────
#  Algorithm  — full read/write
# ─────────────────────────────────────────────
class AlgorithmSerializer(serializers.ModelSerializer):
    # Flatten the "id" field to match frontend shape
    id       = serializers.CharField(source='algo_id')
    category = serializers.SerializerMethodField()

    # Nested collections
    assets    = AssetSerializer(many=True, required=False)
    questions = QuestionSerializer(many=True, required=False)

    # Complexity as nested object
    complexity = serializers.SerializerMethodField()

    # Code as nested object
    code = serializers.SerializerMethodField()

    # Explanation as nested object
    explanation = serializers.SerializerMethodField()

    # ISO timestamps
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)
    updatedAt = serializers.DateTimeField(source='updated_at', read_only=True)

    class Meta:
        model  = Algorithm
        fields = [
            'id', 'name', 'category', 'icon', 'description',
            'complexity', 'code', 'explanation',
            'assets', 'questions',
            'createdAt', 'updatedAt',
        ]

    # ── read helpers ──────────────────────────
    def get_category(self, obj):
        return obj.category.name if obj.category else ''

    def get_complexity(self, obj):
        return {
            'time':        obj.complexity_time,
            'space':       obj.complexity_space,
            'timeRating':  obj.complexity_time_rating,
            'spaceRating': obj.complexity_space_rating,
        }

    def get_code(self, obj):
        def normalise(raw):
            """Ensure all expected keys are present."""
            base = {
                'classCode':     '',
                'functionCode':  '',
                'recursiveCode': '',
                'outcome':       '',
                'runtime':       '',
            }
            if isinstance(raw, dict):
                base.update(raw)
            return base

        return {
            'python': normalise(obj.code_python),
            'cpp':    normalise(obj.code_cpp),
            'c':      normalise(obj.code_c),
            'rust':   normalise(obj.code_rust),
        }

    def get_explanation(self, obj):
        return {
            'problem':       obj.explanation_problem,
            'intuition':     obj.explanation_intuition,
            'walkthrough':   obj.explanation_walkthrough,
            'whenToUse':     obj.explanation_when_to_use,
            'funFact':       obj.explanation_fun_fact,
            'researchLinks': obj.explanation_research_links or [],
        }

    # ── write (create / update) ───────────────
    def _get_or_create_category(self, name):
        if not name:
            return None
        category, _ = Category.objects.get_or_create(name=name)
        return category

    def create(self, validated_data):
        request_data = self.initial_data

        assets_data    = request_data.get('assets', [])
        questions_data = request_data.get('questions', [])

        # Pull nested objects from request (not validated_data, because they are
        # SerializerMethodFields so DRF won't put them in validated_data)
        complexity  = request_data.get('complexity', {})
        code        = request_data.get('code', {})
        explanation = request_data.get('explanation', {})
        category_name = request_data.get('category', '')

        algo = Algorithm.objects.create(
            algo_id     = request_data.get('id', ''),
            name        = request_data.get('name', ''),
            category    = self._get_or_create_category(category_name),
            icon        = request_data.get('icon', 'Sparkles'),
            description = request_data.get('description', ''),

            complexity_time         = complexity.get('time', 'O(n)'),
            complexity_space        = complexity.get('space', 'O(1)'),
            complexity_time_rating  = complexity.get('timeRating', 'average'),
            complexity_space_rating = complexity.get('spaceRating', 'good'),

            code_python = code.get('python', {}),
            code_cpp    = code.get('cpp', {}),
            code_c      = code.get('c', {}),
            code_rust   = code.get('rust', {}),

            explanation_problem     = explanation.get('problem', ''),
            explanation_intuition   = explanation.get('intuition', ''),
            explanation_walkthrough = explanation.get('walkthrough', ''),
            explanation_when_to_use = explanation.get('whenToUse', ''),
            explanation_fun_fact    = explanation.get('funFact', ''),
            explanation_research_links = explanation.get('researchLinks', []),
        )

        # Create related assets
        for asset in assets_data:
            Asset.objects.create(
                algorithm  = algo,
                asset_id   = asset.get('id', ''),
                name       = asset.get('name', ''),
                asset_type = asset.get('type', 'text'),
                data       = asset.get('data', ''),
            )

        # Create related questions
        for q in questions_data:
            Question.objects.create(
                algorithm   = algo,
                question_id = q.get('id', ''),
                text        = q.get('text', ''),
                answer      = q.get('answer', ''),
                language    = q.get('language', 'python'),
                explanation = q.get('explanation', ''),
            )

        # Update category algorithm list (icon might be present in request)
        if algo.category:
            icon = request_data.get('icon')
            # also allow passing category icon via a separate field
            cat_icon = request_data.get('categoryIcon')
            if cat_icon:
                algo.category.icon = cat_icon
                algo.category.save()

        return algo

    def update(self, instance, validated_data):
        request_data = self.initial_data

        complexity  = request_data.get('complexity', {})
        code        = request_data.get('code', {})
        explanation = request_data.get('explanation', {})
        category_name = request_data.get('category', '')

        instance.algo_id     = request_data.get('id', instance.algo_id)
        instance.name        = request_data.get('name', instance.name)
        instance.category    = self._get_or_create_category(category_name)
        instance.icon        = request_data.get('icon', instance.icon)
        instance.description = request_data.get('description', instance.description)

        instance.complexity_time         = complexity.get('time', instance.complexity_time)
        instance.complexity_space        = complexity.get('space', instance.complexity_space)
        instance.complexity_time_rating  = complexity.get('timeRating', instance.complexity_time_rating)
        instance.complexity_space_rating = complexity.get('spaceRating', instance.complexity_space_rating)

        instance.code_python = code.get('python', instance.code_python)
        instance.code_cpp    = code.get('cpp', instance.code_cpp)
        instance.code_c      = code.get('c', instance.code_c)
        instance.code_rust   = code.get('rust', instance.code_rust)

        instance.explanation_problem     = explanation.get('problem', instance.explanation_problem)
        instance.explanation_intuition   = explanation.get('intuition', instance.explanation_intuition)
        instance.explanation_walkthrough = explanation.get('walkthrough', instance.explanation_walkthrough)
        instance.explanation_when_to_use = explanation.get('whenToUse', instance.explanation_when_to_use)
        instance.explanation_fun_fact    = explanation.get('funFact', instance.explanation_fun_fact)
        instance.explanation_research_links = explanation.get('researchLinks', instance.explanation_research_links)

        instance.save()

        # Replace assets & questions entirely
        assets_data    = request_data.get('assets')
        questions_data = request_data.get('questions')

        if assets_data is not None:
            instance.assets.all().delete()
            for asset in assets_data:
                Asset.objects.create(
                    algorithm  = instance,
                    asset_id   = asset.get('id', ''),
                    name       = asset.get('name', ''),
                    asset_type = asset.get('type', 'text'),
                    data       = asset.get('data', ''),
                )

        if questions_data is not None:
            instance.questions.all().delete()
            for q in questions_data:
                Question.objects.create(
                    algorithm   = instance,
                    question_id = q.get('id', ''),
                    text        = q.get('text', ''),
                    answer      = q.get('answer', ''),
                    language    = q.get('language', 'python'),
                    explanation = q.get('explanation', ''),
                )

        return instance
