from rest_framework import serializers

from .models import Board, Card, CardList, User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('firebase_uid', 'created_at', 'updated_at')


class BoardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Board
        fields = ('title', 'user', 'created_at', 'updated_at')


class CardListSerializer(serializers.ModelSerializer):
    class Meta:
        model = CardList
        fields = ('title', 'board', 'created_at', 'updated_at')


class CardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Card
        fields = (
            'title', 'description', 'position', 'card_list', 'created_at',
            'updated_at'
        )
