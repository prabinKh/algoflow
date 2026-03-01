from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Create a router for ViewSet routes
router = DefaultRouter()
router.register(r'algorithms', views.AlgorithmViewSet, basename='algorithm')
router.register(r'categories', views.CategoryViewSet, basename='category')

urlpatterns = [
    # Function-based views (matching original API exactly)
    path('algorithms', views.algorithms_list, name='algorithms-list'),
    path('algorithms/import', views.algorithms_import, name='algorithms-import'),
    path('algorithms/<str:id>', views.algorithm_detail, name='algorithm-detail'),
    path('categories', views.categories_list, name='categories-list'),
    path('categories/<str:name>', views.category_detail, name='category-detail'),
    
    # ViewSet routes (alternative)
    # path('', include(router.urls)),
]
