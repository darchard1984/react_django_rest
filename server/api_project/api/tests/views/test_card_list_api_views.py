import json
from uuid import uuid4

import pytest
from django.test import Client, TestCase
from django.urls import reverse
from mock import Mock, patch
from rest_framework import status

from ...models import Board, Card, CardList, User
from ...serializers import CardListSerializer


@pytest.fixture(scope='module', autouse=True)
def patch_authentication():
    with patch(
        'firebase_auth.firebase_authentication.FirebaseAuthentication.authenticate',
        return_value=(Mock(), None)
    ):
        yield


class TestGetCardList(TestCase):
    def setUp(self):
        user = User.objects.create_user(firebase_uid=str(uuid4()))
        board = Board.objects.create(title='Foo', user=user)

        self.card_list = CardList.objects.create(title='Bar', board=board)

        Card.objects.bulk_create(
            [
                Card(
                    title='Foo',
                    description='Bar',
                    position=1,
                    card_list=self.card_list
                ),
                Card(
                    title='Foo',
                    description='Bar',
                    position=2,
                    card_list=self.card_list
                )
            ]
        )

        self.client = Client()
        self.get_delete_update_endpoint = reverse(
            'get_delete_update_card_list', kwargs={'pk': self.card_list.pk}
        )

    def test_get_card_list(self):
        r = self.client.get(self.get_delete_update_endpoint)

        expected = CardListSerializer(self.card_list)

        self.assertEqual(r.status_code, status.HTTP_200_OK)
        self.assertEqual(r.data, expected.data)
        self.assertEqual(len(r.data.get('cards')), 2)


class TestDeleteCardList(TestCase):
    def setUp(self):
        user = User.objects.create_user(firebase_uid=str(uuid4()))
        board = Board.objects.create(title='Foo', user=user)
        self.card_list = CardList.objects.create(title='Bar', board=board)

        self.client = Client()
        self.get_delete_update_endpoint = reverse(
            'get_delete_update_card_list', kwargs={'pk': self.card_list.pk}
        )

    def test_delete_card_list(self):
        r = self.client.delete(self.get_delete_update_endpoint)

        self.assertEqual(r.status_code, status.HTTP_204_NO_CONTENT)


class TestPutCardList(TestCase):
    def setUp(self):
        user = User.objects.create_user(firebase_uid=str(uuid4()))
        board = Board.objects.create(title='Foo', user=user)
        self.card_list = CardList.objects.create(title='Bar', board=board)

        self.client = Client()
        self.get_delete_update_endpoint = reverse(
            'get_delete_update_card_list', kwargs={'pk': self.card_list.pk}
        )
        self.valid_data = {'title': 'New title'}

        self.invalid_data = {'this_is_invalid': 'bar'}

    def test_update_card_list(self):
        r = self.client.put(
            self.get_delete_update_endpoint,
            kwargs={'pk': self.card_list.pk},
            data=json.dumps(self.valid_data),
            content_type='application/json'
        )

        updated_title = CardList.objects.get(pk=self.card_list.pk).title

        self.assertEqual(r.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(updated_title, self.valid_data.get('title'))

    def test_invalid_card_list_update(self):
        r = self.client.put(
            self.get_delete_update_endpoint,
            kwargs={'pk': self.card_list.pk},
            data=json.dumps(self.invalid_data),
            content_type='application/json'
        )

        self.assertEqual(r.status_code, status.HTTP_400_BAD_REQUEST)


class TestCreateCardList(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(firebase_uid=str(uuid4()))
        self.board = Board.objects.create(title='Foo', user=self.user)
        self.card_list_title = 'Bar'

        self.client = Client()
        self.create_card_list_endpoint = reverse('create_card_list')

    def test_create_card_list(self):
        r = self.client.post(
            self.create_card_list_endpoint,
            data=json.dumps(
                {
                    'title': self.card_list_title,
                    'board': self.board.pk
                }
            ),
            content_type='application/json'
        )

        card_list = CardList.objects.get(title=self.card_list_title)

        self.assertTrue(isinstance(card_list, CardList))
        self.assertTrue(isinstance(card_list.board, Board))
        self.assertTrue(isinstance(card_list.board.user, User))
        self.assertEqual(r.status_code, status.HTTP_201_CREATED)
        self.assertEqual(card_list.title, self.card_list_title)
