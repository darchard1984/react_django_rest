from django.urls import path

from . import views

urlpatterns = [
    path('api/v1/user/<int:pk>', views.get_user, name='get_user'),
    path(
        'api/v1/board/<int:pk>',
        views.get_delete_update_board,
        name='get_delete_update_board'
    ),
    path('api/v1/board/', views.create_board, name='create_board'),
    path(
        'api/v1/boards/',
        views.get_boards,
        name='get_boards'
    ),
    path(
        'api/v1/card-list/<int:pk>',
        views.get_delete_update_card_list,
        name='get_delete_update_card_list'
    ),
    path('api/v1/card-list/', views.create_card_list, name='create_card_list'),
    path(
        'api/v1/card/<int:pk>',
        views.get_delete_update_card,
        name='get_delete_update_card'
    ),
    path('api/v1/card/', views.create_card, name='create_card'),
]
