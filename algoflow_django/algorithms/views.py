from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from .models import Algorithm, Category, Asset, Question
from .serializers import AlgorithmSerializer, CategorySerializer


# ════════════════════════════════════════════════════════════
#  ALGORITHM ENDPOINTS
#  GET    /api/algorithms/          — list all
#  POST   /api/algorithms/          — create new
#  GET    /api/algorithms/<id>/     — retrieve one
#  PUT    /api/algorithms/<id>/     — full update
#  PATCH  /api/algorithms/<id>/     — partial update
#  DELETE /api/algorithms/<id>/     — delete
# ════════════════════════════════════════════════════════════

@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def algorithm_list(request):
    """
    GET  — Return all algorithms (used by Sidebar, Home, Documentation pages).
    POST — Create a new algorithm (used by ForgeAlgorithm page).
    """
    if request.method == 'GET':
        algorithms = Algorithm.objects.prefetch_related('assets', 'questions').select_related('category').all()

        # Optional search filter  ?search=binary
        search = request.query_params.get('search', '').strip()
        if search:
            algorithms = algorithms.filter(name__icontains=search)

        # Optional category filter  ?category=Sorting
        category = request.query_params.get('category', '').strip()
        if category:
            algorithms = algorithms.filter(category__name__iexact=category)

        serializer = AlgorithmSerializer(algorithms, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == 'POST':
        # Check if algo_id already exists — frontend generates it from the name
        algo_id = request.data.get('id', '')
        if algo_id and Algorithm.objects.filter(algo_id=algo_id).exists():
            return Response(
                {'error': f'Algorithm with id "{algo_id}" already exists.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = AlgorithmSerializer(data=request.data)
        if serializer.is_valid():
            algo = serializer.save()
            return Response(AlgorithmSerializer(algo).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
@permission_classes([AllowAny])
def algorithm_detail(request, algo_id):
    """
    Retrieve, update, or delete a single algorithm by its frontend id (e.g. "bubble-sort").
    Used by AlgorithmViewer, ForgeAlgorithm (edit mode), and Dashboard delete.
    """
    algo = get_object_or_404(
        Algorithm.objects.prefetch_related('assets', 'questions').select_related('category'),
        algo_id=algo_id
    )

    if request.method == 'GET':
        serializer = AlgorithmSerializer(algo)
        return Response(serializer.data)

    elif request.method in ('PUT', 'PATCH'):
        partial = request.method == 'PATCH'
        serializer = AlgorithmSerializer(algo, data=request.data, partial=partial)
        if serializer.is_valid():
            updated = serializer.save()
            return Response(AlgorithmSerializer(updated).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        algo.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# ════════════════════════════════════════════════════════════
#  CATEGORY ENDPOINTS
#  GET  /api/categories/      — list all categories with algorithm ids
#  POST /api/categories/      — create a category
# ════════════════════════════════════════════════════════════

@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def category_list(request):
    """
    GET  — Return all categories with their algorithm id lists.
           Used by Sidebar and ForgeAlgorithm category selector.
    POST — Create a new category (used by ForgeAlgorithm "Add Category" feature).
    """
    if request.method == 'GET':
        categories = Category.objects.prefetch_related('algorithms').all()
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        name = request.data.get('name', '').strip()
        icon = request.data.get('icon', 'Box').strip()

        if not name:
            return Response({'error': 'Category name is required.'}, status=status.HTTP_400_BAD_REQUEST)

        category, created = Category.objects.get_or_create(name=name, defaults={'icon': icon})
        if not created:
            return Response({'error': f'Category "{name}" already exists.'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = CategorySerializer(category)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([AllowAny])
def category_detail(request, name):
    """
    GET    — Retrieve a single category.
    PUT    — Update name / icon.
    DELETE — Delete category (algorithms keep their data but lose the FK).
    """
    category = get_object_or_404(Category, name=name)

    if request.method == 'GET':
        serializer = CategorySerializer(category)
        return Response(serializer.data)

    elif request.method == 'PUT':
        category.name = request.data.get('name', category.name)
        category.icon = request.data.get('icon', category.icon)
        category.save()
        return Response(CategorySerializer(category).data)

    elif request.method == 'DELETE':
        category.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# ════════════════════════════════════════════════════════════
#  ASSET ENDPOINTS
#  POST   /api/algorithms/<id>/assets/          — add asset
#  DELETE /api/algorithms/<id>/assets/<asset_id>/ — remove asset
# ════════════════════════════════════════════════════════════

@api_view(['POST'])
@permission_classes([AllowAny])
def asset_create(request, algo_id):
    """
    Add a single asset to an algorithm.
    Expects: { id, name, type, data }
    """
    algo = get_object_or_404(Algorithm, algo_id=algo_id)

    asset = Asset.objects.create(
        algorithm  = algo,
        asset_id   = request.data.get('id', ''),
        name       = request.data.get('name', ''),
        asset_type = request.data.get('type', 'text'),
        data       = request.data.get('data', ''),
    )
    return Response({
        'id':   asset.asset_id,
        'name': asset.name,
        'type': asset.asset_type,
        'data': asset.data,
    }, status=status.HTTP_201_CREATED)


@api_view(['DELETE'])
@permission_classes([AllowAny])
def asset_delete(request, algo_id, asset_id):
    """Remove a single asset from an algorithm."""
    algo  = get_object_or_404(Algorithm, algo_id=algo_id)
    asset = get_object_or_404(Asset, algorithm=algo, asset_id=asset_id)
    asset.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


# ════════════════════════════════════════════════════════════
#  QUESTION ENDPOINTS
#  POST   /api/algorithms/<id>/questions/             — add question
#  PUT    /api/algorithms/<id>/questions/<q_id>/      — update question
#  DELETE /api/algorithms/<id>/questions/<q_id>/      — remove question
# ════════════════════════════════════════════════════════════

@api_view(['POST'])
@permission_classes([AllowAny])
def question_create(request, algo_id):
    """
    Add a single question to an algorithm.
    Expects: { id, text, answer, language, explanation }
    """
    algo = get_object_or_404(Algorithm, algo_id=algo_id)

    question = Question.objects.create(
        algorithm   = algo,
        question_id = request.data.get('id', ''),
        text        = request.data.get('text', ''),
        answer      = request.data.get('answer', ''),
        language    = request.data.get('language', 'python'),
        explanation = request.data.get('explanation', ''),
    )
    return Response({
        'id':          question.question_id,
        'text':        question.text,
        'answer':      question.answer,
        'language':    question.language,
        'explanation': question.explanation,
    }, status=status.HTTP_201_CREATED)


@api_view(['PUT', 'DELETE'])
@permission_classes([AllowAny])
def question_detail(request, algo_id, question_id):
    """Update or delete a single question."""
    algo     = get_object_or_404(Algorithm, algo_id=algo_id)
    question = get_object_or_404(Question, algorithm=algo, question_id=question_id)

    if request.method == 'PUT':
        question.text        = request.data.get('text', question.text)
        question.answer      = request.data.get('answer', question.answer)
        question.language    = request.data.get('language', question.language)
        question.explanation = request.data.get('explanation', question.explanation)
        question.save()
        return Response({
            'id':          question.question_id,
            'text':        question.text,
            'answer':      question.answer,
            'language':    question.language,
            'explanation': question.explanation,
        })

    elif request.method == 'DELETE':
        question.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# ════════════════════════════════════════════════════════════
#  BULK IMPORT ENDPOINT
#  POST /api/algorithms/import/
#  Accepts an array of Algorithm objects — used by Dashboard import
# ════════════════════════════════════════════════════════════

@api_view(['POST'])
@permission_classes([AllowAny])
def algorithm_bulk_import(request):
    """
    Accepts a JSON array of algorithm objects (same shape as the export).
    Skips duplicates (by algo_id). Returns a summary.
    """
    data = request.data
    if not isinstance(data, list):
        return Response({'error': 'Expected a JSON array.'}, status=status.HTTP_400_BAD_REQUEST)

    created  = []
    skipped  = []
    errors   = []

    for item in data:
        algo_id = item.get('id', '')
        if Algorithm.objects.filter(algo_id=algo_id).exists():
            skipped.append(algo_id)
            continue

        serializer = AlgorithmSerializer(data=item)
        if serializer.is_valid():
            algo = serializer.save()
            created.append(algo.algo_id)
        else:
            errors.append({'id': algo_id, 'errors': serializer.errors})

    return Response({
        'created': created,
        'skipped': skipped,
        'errors':  errors,
    }, status=status.HTTP_200_OK)


# ════════════════════════════════════════════════════════════
#  STATS ENDPOINT  (used by Dashboard stats cards)
#  GET /api/algorithms/stats/
# ════════════════════════════════════════════════════════════

@api_view(['GET'])
@permission_classes([AllowAny])
def algorithm_stats(request):
    """
    Returns aggregate stats consumed by the Dashboard stat cards.
    """
    from django.db.models import Count

    total_algos      = Algorithm.objects.count()
    total_categories = Category.objects.count()

    # Count total implementations across all languages
    algos     = Algorithm.objects.all()
    total_impl = 0
    for algo in algos:
        for code in [algo.code_python, algo.code_cpp, algo.code_c, algo.code_rust]:
            if isinstance(code, dict) and (code.get('functionCode') or code.get('classCode') or code.get('recursiveCode')):
                total_impl += 1

    # Complexity distribution for the pie chart
    complexity_dist = (
        Algorithm.objects
        .values('complexity_time')
        .annotate(count=Count('id'))
        .order_by('-count')
    )

    return Response({
        'totalAlgorithms':    total_algos,
        'totalCategories':    total_categories,
        'totalImplementations': total_impl,
        'complexityDistribution': [
            {'name': item['complexity_time'], 'value': item['count']}
            for item in complexity_dist
        ],
    })
