from django.urls import path
from . import views

urlpatterns = [

    # ── Algorithms ──────────────────────────────────────────
    # GET  /api/algorithms/          list all + optional ?search= / ?category=
    # POST /api/algorithms/          create new algorithm
    path('algorithms/', views.algorithm_list, name='algorithm-list'),

    # GET    /api/algorithms/stats/  aggregate stats for Dashboard
    path('algorithms/stats/', views.algorithm_stats, name='algorithm-stats'),

    # POST   /api/algorithms/import/ bulk import from JSON array
    path('algorithms/import/', views.algorithm_bulk_import, name='algorithm-bulk-import'),

    # GET    /api/algorithms/<id>/   retrieve single algorithm
    # PUT    /api/algorithms/<id>/   full update
    # PATCH  /api/algorithms/<id>/   partial update
    # DELETE /api/algorithms/<id>/   delete
    path('algorithms/<str:algo_id>/', views.algorithm_detail, name='algorithm-detail'),

    # ── Assets ──────────────────────────────────────────────
    # POST   /api/algorithms/<id>/assets/                 add asset
    path('algorithms/<str:algo_id>/assets/', views.asset_create, name='asset-create'),

    # DELETE /api/algorithms/<id>/assets/<asset_id>/      remove asset
    path('algorithms/<str:algo_id>/assets/<str:asset_id>/', views.asset_delete, name='asset-delete'),

    # ── Questions ───────────────────────────────────────────
    # POST   /api/algorithms/<id>/questions/              add question
    path('algorithms/<str:algo_id>/questions/', views.question_create, name='question-create'),

    # PUT    /api/algorithms/<id>/questions/<q_id>/       update question
    # DELETE /api/algorithms/<id>/questions/<q_id>/       delete question
    path('algorithms/<str:algo_id>/questions/<str:question_id>/', views.question_detail, name='question-detail'),

    # ── Categories ──────────────────────────────────────────
    # GET  /api/categories/          list all categories
    # POST /api/categories/          create new category
    path('categories/', views.category_list, name='category-list'),

    # GET    /api/categories/<name>/ retrieve single category
    # PUT    /api/categories/<name>/ update category
    # DELETE /api/categories/<name>/ delete category
    path('categories/<str:name>/', views.category_detail, name='category-detail'),
]
