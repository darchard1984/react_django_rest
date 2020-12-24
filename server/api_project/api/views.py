from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Board, Card, CardList, User
from .serializers import (BoardSerializer, BoardWriteSerializer,
                          CardListSerializer, CardListWriteSerializer,
                          CardSerializer, CardWriteSerializer, UserSerializer)

import os


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
        serialized = serializer(entity, data=request.data.get('data'))

        if serialized.is_valid():
            serialized.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(serialized.errors, status=status.HTTP_400_BAD_REQUEST)


def _handle_post(request, serializer, resource):
    serialized = serializer(data=request.data.get('data'))

    if serialized.is_valid():
        serialized.save()
        api_base = os.getenv('API_BASE')
        path = f"{resource}/{serialized.data.get('pk')}/"

        return Response(
            status=status.HTTP_201_CREATED,
            headers={
                'Location': f"{api_base}/{path}/"
            }
        )

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
    return _handle_post(request, BoardWriteSerializer, 'board')


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
    return _handle_post(request, CardListWriteSerializer, 'card-list')


@api_view(['GET'])
def get_card_lists(request):
    pk_list = request.GET.get('pks').split(',')
    entities = CardList.objects.filter(pk__in=pk_list)

    return Response([CardListSerializer(entity).data for entity in entities])


# CARD VIEWS
@api_view(['GET', 'DELETE', 'PUT'])
def get_delete_update_card(request, pk):
    return _handle_get_delete_update(request, pk, CardSerializer, Card)


@api_view(['POST'])
def create_card(request):
    return _handle_post(request, CardWriteSerializer, 'card')


@api_view(['PUT'])
def update_cards(request):
    cards_to_update = request.data.get('data')
    serialized_cards = []
    did_fail = False

    for card in cards_to_update:
        data = {
            'title': card.get('title'),
            'description': card.get('description'),
            'position': card.get('position'),
            'card_list': card.get('card_list'),
        }

        try:
            entity = Card.objects.get(pk=card.get('pk'))

        except Card.DoesNotExist:
            did_fail = True
            break

        serialized_card = CardWriteSerializer(entity, data)
        if serialized_card.is_valid():
            serialized_cards.append(serialized_card)
        else:
            did_fail = True
            break

    if did_fail:
        return Response(status=status.HTTP_400_BAD_REQUEST)

    for card in serialized_cards:
        card.save()

    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET'])
def get_cards(request):
    pk_list = request.GET.get('pks').split(',')
    entities = Card.objects.filter(pk__in=pk_list)

    return Response([CardSerializer(entity).data for entity in entities])
