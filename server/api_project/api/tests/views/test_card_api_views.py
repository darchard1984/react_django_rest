import json
from uuid import uuid4

from django.test import Client, TestCase
from django.urls import reverse
from rest_framework import status

from ...models import Board, Card, CardList, User
from ...serializers import CardSerializer


class TestGetCard(TestCase):
    def setUp(self):
        user = User.objects.create_user(firebase_uid=str(uuid4()))
        board = Board.objects.create(title='Foo', user=user)
        card_list = CardList.objects.create(title='Bar', board=board)

        self.card = Card.objects.create(
            title='Foo', description='Bar', position=1, card_list=card_list
        )

        self.client = Client()
        self.get_delete_update_endpoint = reverse(
            'get_delete_update_card', kwargs={'pk': self.card.pk}
        )

    def test_get_card(self):
        r = self.client.get(self.get_delete_update_endpoint)

        expected = CardSerializer(self.card)

        self.assertEqual(r.status_code, status.HTTP_200_OK)
        self.assertEqual(r.data, expected.data)


class TestDeleteCard(TestCase):
    def setUp(self):
        user = User.objects.create_user(firebase_uid=str(uuid4()))
        board = Board.objects.create(title='Foo', user=user)
        card_list = CardList.objects.create(title='Bar', board=board)

        self.card = Card.objects.create(
            title='Foo', description='Bar', position=1, card_list=card_list
        )

        self.client = Client()
        self.get_delete_update_endpoint = reverse(
            'get_delete_update_card', kwargs={'pk': self.card.pk}
        )

    def test_delete_card(self):
        r = self.client.delete(self.get_delete_update_endpoint)

        self.assertEqual(r.status_code, status.HTTP_204_NO_CONTENT)


class TestPutCard(TestCase):
    def setUp(self):
        user = User.objects.create_user(firebase_uid=str(uuid4()))
        board = Board.objects.create(title='Foo', user=user)
        card_list = CardList.objects.create(title='Bar', board=board)

        self.card = Card.objects.create(
            title='Foo', description='Bar', position=1, card_list=card_list
        )

        self.client = Client()
        self.get_delete_update_endpoint = reverse(
            'get_delete_update_card', kwargs={'pk': self.card.pk}
        )

        self.valid_data = {
            'title': 'New title',
            'description': 'New description',
            'position': 1
        }

        self.invalid_data = {'this_is_invalid': 'bar'}

    def test_update_card(self):
        r = self.client.put(
            self.get_delete_update_endpoint,
            kwargs={'pk': self.card.pk},
            data=json.dumps(self.valid_data),
            content_type='application/json'
        )

        updated_title = Card.objects.get(pk=self.card.pk).title

        self.assertEqual(r.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(updated_title, self.valid_data.get('title'))

    def test_invalid_card_update(self):
        r = self.client.put(
            self.get_delete_update_endpoint,
            kwargs={'pk': self.card.pk},
            data=json.dumps(self.invalid_data),
            content_type='application/json'
        )

        self.assertEqual(r.status_code, status.HTTP_400_BAD_REQUEST)


class TestCreateCard(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(firebase_uid=str(uuid4()))
        self.board = Board.objects.create(title='Foo', user=self.user)
        self.card_list = CardList.objects.create(title='Bar', board=self.board)
        self.card_title = 'New title'
        self.card_description = 'New description'
        self.position = 1

        self.client = Client()
        self.create_card_endpoint = reverse('create_card')

    def test_create_card(self):
        r = self.client.post(
            self.create_card_endpoint,
            data=json.dumps(
                {
                    'title': self.card_title,
                    'description': self.card_description,
                    'position': self.position,
                    'card_list': self.card_list.pk
                }
            ),
            content_type='application/json'
        )

        card = Card.objects.get(title=self.card_title)

        self.assertTrue(isinstance(card, Card))
        self.assertTrue(isinstance(card.card_list, CardList))
        self.assertTrue(isinstance(card.card_list.board, Board))
        self.assertTrue(isinstance(card.card_list.board.user, User))
        self.assertEqual(r.status_code, status.HTTP_201_CREATED)
        self.assertEqual(card.title, self.card_title)
