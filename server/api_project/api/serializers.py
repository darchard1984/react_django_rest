from rest_framework import serializers

from .models import Board, Card, CardList, User


# USER SERIALIZERS
class UserSerializer(serializers.ModelSerializer):
    boards = serializers.PrimaryKeyRelatedField(read_only=True, many=True)

    class Meta:
        model = User
        fields = ('pk', 'firebase_uid', 'boards', 'created_at', 'updated_at')


# BOARD SERIALIZERS
class BoardSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    card_lists = serializers.PrimaryKeyRelatedField(read_only=True, many=True)

    class Meta:
        model = Board
        fields = (
            'pk', 'title', 'user', 'card_lists', 'created_at', 'updated_at'
        )


class BoardWriteSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())

    class Meta:
        model = Board
        fields = ('pk', 'title', 'user', 'created_at', 'updated_at')


# CARD LIST SERIALIZERS
class CardListSerializer(serializers.ModelSerializer):
    board = serializers.PrimaryKeyRelatedField(read_only=True)
    cards = serializers.PrimaryKeyRelatedField(read_only=True, many=True)

    class Meta:
        model = CardList
        fields = ('pk', 'title', 'board', 'cards', 'created_at', 'updated_at')


class CardListWriteSerializer(serializers.ModelSerializer):
    board = serializers.PrimaryKeyRelatedField(queryset=Board.objects.all())

    class Meta:
        model = CardList
        fields = ('pk', 'title', 'board', 'created_at', 'updated_at')


# CARD SERIALIZERS
class CardSerializer(serializers.ModelSerializer):
    card_list = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Card
        fields = (
            'pk', 'title', 'description', 'position', 'card_list',
            'created_at', 'updated_at'
        )


class CardWriteSerializer(serializers.ModelSerializer):
    card_list = serializers.PrimaryKeyRelatedField(
        queryset=CardList.objects.all()
    )

    class Meta:
        model = Card
        fields = (
            'pk', 'title', 'description', 'position', 'card_list',
            'created_at', 'updated_at'
        )
