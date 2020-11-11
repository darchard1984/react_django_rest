from django.urls import path

from . import views

urlpatterns = [
    path(
        'api/v1/user/<int:pk>',
        views.get_delete_update_user,
        name='get_delete_update_user'
    ),
    path('api/v1/users/', views.create_user, name='create_user'),
    path(
        'api/v1/board/<int:pk>',
        views.get_delete_update_board,
        name='get_delete_update_board'
    ),
    path('api/v1/board/', views.create_board, name='create_board'),
]
