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


def _handle_post(request, serializer):
    serialized = serializer(data=request.data.get('data'))

    if serialized.is_valid():
        serialized.save()
        return Response(serialized.data, status=status.HTTP_201_CREATED)

    return Response(serialized.errors, status=status.HTTP_400_BAD_REQUEST)


# USER VIEWS
@api_view(['GET'])
def get_user(request, pk):
    return _handle_get_delete_update(request, pk, UserSerializer, User)


# BOARD VIEWS
@api_view(['GET', 'DELETE', 'PUT'])
def get_delete_update_board(request, pk):
    return _handle_get_delete_update(request, pk, BoardSerializer, Board)


@api_view(['POST'])
def create_board(request):
    return _handle_post(request, BoardWriteSerializer)


# BOARDS VIEWS
@api_view(['GET'])
def get_boards(request):
    pk_list = request.GET.get('pks').split(',')
    entities = Board.objects.filter(pk__in=pk_list)

    return Response([BoardSerializer(entity).data for entity in entities])


# CARD LIST VIEWS
@api_view(['GET', 'DELETE', 'PUT'])
def get_delete_update_card_list(request, pk):
    return _handle_get_delete_update(request, pk, CardListSerializer, CardList)


@api_view(['POST'])
def create_card_list(request):
    return _handle_post(request, CardListWriteSerializer)


# CARD VIEWS
@api_view(['GET', 'DELETE', 'PUT'])
def get_delete_update_card(request, pk):
    return _handle_get_delete_update(request, pk, CardSerializer, Card)


@api_view(['POST'])
def create_card(request):
    return _handle_post(request, CardWriteSerializer)
