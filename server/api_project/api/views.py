from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Board, Card, CardList, User
from .serializers import (BoardSerializer, BoardWriteSerializer,
                          CardListSerializer, CardListWriteSerializer,
                          CardSerializer, CardWriteSerializer, UserSerializer)


def _handle_get_delete_update(request, pk, serializer, model):
    try:
        entity = model.objects.get(pk=pk)
    except model.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serialized = serializer(entity)
        return Response(serialized.data)

    elif request.method == 'DELETE':
        entity.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    elif request.method == 'PUT':
        serialized = serializer(entity, data=request.data)

        if serialized.is_valid():
            serialized.save()
            return Response(serialized.data, status=status.HTTP_204_NO_CONTENT)
        return Response(serialized.errors, status=status.HTTP_400_BAD_REQUEST)


def _handle_post(request, data, serializer):
    serialized = serializer(data=data)
    if serialized.is_valid():
        serialized.save()
        return Response(serialized.data, status=status.HTTP_201_CREATED)

    return Response(serialized.errors, status=status.HTTP_400_BAD_REQUEST)


# USER VIEWS
@api_view(['GET', 'DELETE', 'PUT'])
def get_delete_update_user(request, pk):
    return _handle_get_delete_update(request, pk, UserSerializer, User)


@api_view(['POST'])
def create_user(request):
    user_data = {'firebase_uid': request.data.get('firebase_uid')}
    return _handle_post(request, user_data, UserSerializer)


# BOARD VIEWS
@api_view(['GET', 'DELETE', 'PUT'])
def get_delete_update_board(request, pk):
    return _handle_get_delete_update(request, pk, BoardSerializer, Board)


@api_view(['POST'])
def create_board(request):
    board_data = {
        'title': request.data.get('title'),
        'user': request.data.get('user')
    }

    return _handle_post(request, board_data, BoardWriteSerializer)


# CARD LIST VIEWS
@api_view(['GET', 'DELETE', 'PUT'])
def get_delete_update_card_list(request, pk):
    return _handle_get_delete_update(request, pk, CardListSerializer, CardList)


@api_view(['POST'])
def create_card_list(request):
    card_list_data = {
        'title': request.data.get('title'),
        'board': request.data.get('board')
    }

    return _handle_post(request, card_list_data, CardListWriteSerializer)


# CARD VIEWS
@api_view(['GET', 'DELETE', 'PUT'])
def get_delete_update_card(request, pk):
    return _handle_get_delete_update(request, pk, CardSerializer, Card)


@api_view(['POST'])
def create_card(request):
    card_data = {
        'title': request.data.get('title'),
        'description': request.data.get('description'),
        'position': request.data.get('position'),
        'card_list': request.data.get('card_list')
    }

    return _handle_post(request, card_data, CardWriteSerializer)
