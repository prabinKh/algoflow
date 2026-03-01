from django.urls import path
from . import views

urlpatterns = [
    path('register', views.register, name='register'),
    path('login', views.user_login, name='login'),
    path('logout', views.user_logout, name='logout'),
    path('me', views.current_user, name='current-user'),
    path('check-admin', views.check_admin, name='check-admin'),
]
