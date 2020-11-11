from rest_framework import serializers

from .models import Board, Card, CardList, User

# USER SERIALIZERS


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('pk', 'firebase_uid', 'created_at', 'updated_at')


# BOARD SERIALIZERS
class BoardSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Board
        fields = ('pk', 'title', 'user', 'created_at', 'updated_at')


class BoardWriteSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())

    class Meta:
        model = Board
        fields = ('pk', 'title', 'user', 'created_at', 'updated_at')


# CARD LIST SERIALIZERS
class CardListSerializer(serializers.ModelSerializer):
    class Meta:
        model = CardList
        fields = ('pk', 'title', 'board', 'created_at', 'updated_at')


# CARD SERIALIZERS
class CardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Card
        fields = (
            'pk', 'title', 'description', 'position', 'card_list',
            'created_at', 'updated_at'
        )
