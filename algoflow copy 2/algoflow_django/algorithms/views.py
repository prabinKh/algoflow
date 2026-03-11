from rest_framework import viewsets, status
from rest_framework.decorators import action, permission_classes, api_view
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from account.models import MyUser
from .models import Algorithm, Category
from .serializers import AlgorithmSerializer, CategorySerializer, AlgorithmImportSerializer


class IsAdminOrStaffUser(IsAuthenticated):
    """Custom permission to allow only admin or staff users."""
    
  def has_permission(self, request, view):
        # First check if user is authenticated
      if not super().has_permission(request, view):
            return False
        
        # Check if user is admin or staff
        return request.user.is_authenticated and (request.user.is_staff or request.user.is_superuser)


class CategoryViewSet(viewsets.ModelViewSet):
    """ViewSet for Category CRUD operations."""
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = 'name'
    
    def destroy(self, request, *args, **kwargs):
        """Delete a category."""
        category = self.get_object()
        category.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class AlgorithmViewSet(viewsets.ModelViewSet):
    """ViewSet for Algorithm CRUD operations."""
    queryset = Algorithm.objects.all()
    serializer_class = AlgorithmSerializer
    lookup_field = 'id'
    
    def get_queryset(self):
        """Filter algorithms by category if provided."""
        queryset = Algorithm.objects.all()
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category__name=category)
        return queryset
    
    def destroy(self, request, *args, **kwargs):
        """Delete an algorithm."""
        algorithm = self.get_object()
        algorithm.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    @action(detail=False, methods=['post'])
    def import_bulk(self, request):
        """Bulk import algorithms from JSON array."""
        algorithms_data = request.data
        
        if not isinstance(algorithms_data, list):
            return Response(
                {'error': 'Expected an array of algorithms'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        created_count = 0
        errors = []
        
        for algo_data in algorithms_data:
            try:
                category_name = algo_data.get('category', 'Uncategorized')
                category, _ = Category.objects.get_or_create(name=category_name)
                
                complexity = algo_data.get('complexity', {})
                
                Algorithm.objects.update_or_create(
                    id=algo_data.get('id'),
                    defaults={
                        'name': algo_data.get('name', ''),
                        'category': category,
                        'description': algo_data.get('description', ''),
                        'icon': algo_data.get('icon'),
                        'complexity_time': complexity.get('time', 'O(n)'),
                        'complexity_space': complexity.get('space', 'O(1)'),
                        'complexity_time_rating': complexity.get('timeRating', 'average'),
                        'complexity_space_rating': complexity.get('spaceRating', 'good'),
                        'code': algo_data.get('code', {}),
                        'explanation': algo_data.get('explanation', {}),
                        'assets': algo_data.get('assets', [])
                    }
                )
                created_count += 1
            except Exception as e:
                errors.append({'algorithm': algo_data.get('id'), 'error': str(e)})
        
        return Response({
            'status': 'success',
            'count': created_count,
            'errors': errors if errors else None
        })
    
    @action(detail=False, methods=['get'])
    def by_category(self, request):
        """Get algorithms grouped by category."""
        categories = Category.objects.all()
        result = []
        
        for category in categories:
            algos = Algorithm.objects.filter(category=category)
            result.append({
                'category': CategorySerializer(category).data,
                'algorithms': AlgorithmSerializer(algos, many=True).data
            })
        
        return Response(result)


# Function-based views for specific routes (matching original API)


@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def algorithms_list(request):
    """List all algorithms or create new one."""
    if request.method == 'GET':
        algorithms = Algorithm.objects.all()
        serializer = AlgorithmSerializer(algorithms, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        # Check admin permission for POST
        if not request.user.is_authenticated:
            return Response({'error': 'Authentication required'}, status=status.HTTP_403_FORBIDDEN)
        if not request.user.is_admin:
            return Response({'error': 'Admin access required'}, status=status.HTTP_403_FORBIDDEN)
        serializer = AlgorithmSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([AllowAny])
def algorithm_detail(request, id):
    """Get, update or delete a specific algorithm."""
    try:
        algorithm = Algorithm.objects.get(pk=id)
    except Algorithm.DoesNotExist:
        return Response({'error': 'Algorithm not found'}, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = AlgorithmSerializer(algorithm)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        # Check admin permission for PUT
        if not request.user.is_authenticated or not request.user.is_admin:
            return Response({'error': 'Admin access required'}, status=status.HTTP_403_FORBIDDEN)
        serializer = AlgorithmSerializer(algorithm, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        # Check admin permission for DELETE
        if not request.user.is_authenticated or not request.user.is_admin:
            return Response({'error': 'Admin access required'}, status=status.HTTP_403_FORBIDDEN)
        algorithm.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def categories_list(request):
    """List all categories or create new one."""
    if request.method == 'GET':
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        # Check admin permission for POST
        if not request.user.is_authenticated or not request.user.is_admin:
            return Response({'error': 'Admin access required'}, status=status.HTTP_403_FORBIDDEN)
        serializer = CategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def category_detail(request, name):
    """Delete a category."""
    try:
        category = Category.objects.get(pk=name)
    except Category.DoesNotExist:
        return Response({'error': 'Category not found'}, status=status.HTTP_404_NOT_FOUND)
    
    category.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def algorithms_import(request):
    """Bulk import algorithms."""
    if not isinstance(request.data, list):
        return Response(
            {'error': 'Expected an array of algorithms'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    created_count = 0
    
    for algo_data in request.data:
        try:
            category_name = algo_data.get('category', 'Uncategorized')
            category, _ = Category.objects.get_or_create(name=category_name)
            
            complexity = algo_data.get('complexity', {})
            
            Algorithm.objects.update_or_create(
                id=algo_data.get('id'),
                defaults={
                    'name': algo_data.get('name', ''),
                    'category': category,
                    'description': algo_data.get('description', ''),
                    'icon': algo_data.get('icon'),
                    'complexity_time': complexity.get('time', 'O(n)'),
                    'complexity_space': complexity.get('space', 'O(1)'),
                    'complexity_time_rating': complexity.get('timeRating', 'average'),
                    'complexity_space_rating': complexity.get('spaceRating', 'good'),
                    'code': algo_data.get('code', {}),
                    'explanation': algo_data.get('explanation', {}),
                    'assets': algo_data.get('assets', [])
                }
            )
            created_count += 1
        except Exception as e:
            pass  # Skip failed imports
    
    return Response({'status': 'success', 'count': created_count})
