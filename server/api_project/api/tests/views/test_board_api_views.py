import json
from uuid import uuid4

import pytest
from django.test import Client, TestCase
from django.urls import reverse
from mock import Mock, patch
from rest_framework import status

from ...models import Board, CardList, User
from ...serializers import BoardSerializer


@pytest.fixture(scope='module', autouse=True)
def patch_authentication():
    with patch(
        'firebase_auth.firebase_authentication.FirebaseAuthentication.authenticate',
        return_value=(Mock(), None)
    ):
        yield


class TestGetBoard(TestCase):
    def setUp(self):
        self.board = Board.objects.create(
            title='Foo',
            user=User.objects.create_user(firebase_uid=str(uuid4()))
        )

        CardList.objects.bulk_create(
            [
                CardList(title='Foo', board=self.board),
                CardList(title='Bar', board=self.board)
            ]
        )

        self.client = Client()
        self.get_delete_update_endpoint = reverse(
            'get_delete_update_board', kwargs={'pk': self.board.pk}
        )

    def test_get_board(self):
        r = self.client.get(self.get_delete_update_endpoint)

        expected = BoardSerializer(self.board)

        self.assertEqual(r.status_code, status.HTTP_200_OK)
        self.assertEqual(r.data, expected.data)
        self.assertEqual(len(r.data.get('card_lists')), 2)


class TestDeleteBoard(TestCase):
    def setUp(self):
        self.board = Board.objects.create(
            title='Foo',
            user=User.objects.create_user(firebase_uid=str(uuid4()))
        )

        self.client = Client()
        self.get_delete_update_endpoint = reverse(
            'get_delete_update_board', kwargs={'pk': self.board.pk}
        )

    def test_delete_bqoard(self):
        r = self.client.delete(self.get_delete_update_endpoint)

        self.assertEqual(r.status_code, status.HTTP_204_NO_CONTENT)


class TestPutBoard(TestCase):
    def setUp(self):
        self.board = Board.objects.create(
            title='Foo',
            user=User.objects.create_user(firebase_uid=str(uuid4()))
        )

        self.client = Client()
        self.get_delete_update_endpoint = reverse(
            'get_delete_update_board', kwargs={'pk': self.board.pk}
        )

        self.valid_data = {'title': 'New title'}

        self.invalid_data = {'this_is_invalid': 'bar'}

    def test_update_board(self):
        r = self.client.put(
            self.get_delete_update_endpoint,
            kwargs={'pk': self.board.pk},
            data=json.dumps(self.valid_data),
            content_type='application/json'
        )

        updated_title = Board.objects.get(pk=self.board.pk).title

        self.assertEqual(r.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(updated_title, self.valid_data.get('title'))

    def test_invalid_board_update(self):
        r = self.client.put(
            self.get_delete_update_endpoint,
            kwargs={'pk': self.board.pk},
            data=json.dumps(self.invalid_data),
            content_type='application/json'
        )

        self.assertEqual(r.status_code, status.HTTP_400_BAD_REQUEST)


class TestCreateBoard(TestCase):
    def setUp(self):
        self.client = Client()
        self.create_board_endpoint = reverse('create_board')
        self.board_title = 'Foo'

        self.user_mock_firebase_uid = str(uuid4())
        self.user = User.objects.create_user(
            firebase_uid=self.user_mock_firebase_uid
        )

    def test_create_board(self):
        r = self.client.post(
            self.create_board_endpoint,
            data=json.dumps({
                'data': {
                    'title': self.board_title,
                    'user': self.user.pk
                }
            }),
            content_type='application/json'
        )

        board = Board.objects.get(title=self.board_title)

        self.assertTrue(isinstance(board, Board))
        self.assertTrue(isinstance(board.user, User))
        self.assertEqual(r.status_code, status.HTTP_201_CREATED)
        self.assertEqual(board.title, self.board_title)


class TestGetBoards(TestCase):
    def setUp(self):
        self.board1 = Board.objects.create(
            title='Foo',
            user=User.objects.create_user(firebase_uid=str(uuid4()))
        )
        self.board2 = Board.objects.create(
            title='Bar',
            user=User.objects.create_user(firebase_uid=str(uuid4()))
        )

        CardList.objects.bulk_create(
            [
                CardList(title='Foo', board=self.board1),
                CardList(title='Bar', board=self.board2)
            ]
        )

        self.client = Client()
        self.get_boards_endpoint = reverse(
            'get_boards'
        )

    def test_get_boards(self):
        r = self.client.get(f'{self.get_boards_endpoint}?pks=1,2')

        expected = [
            BoardSerializer(board).data for board in [self.board1, self.board2]
        ]

        self.assertEqual(r.status_code, status.HTTP_200_OK)
        self.assertEqual(r.data, expected)
