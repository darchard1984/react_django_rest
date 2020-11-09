from django.urls import path

from . import views

urlpatterns = [
    path(
        'api/v1/<int:pk>',
        views.get_delete_update_user,
        name='get_delete_update_user'
    ),
    path(r'^api/v1/users/$', views.create_user, name='create_user')
]
