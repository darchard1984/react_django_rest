import json
from uuid import uuid4

from django.test import Client, TestCase
from django.urls import reverse
from rest_framework import status

from ...models import Board, User
from ...serializers import BoardSerializer


class TestGetBoard(TestCase):
    def setUp(self):
        self.board = Board.objects.create(
            title='Foo', user=User.objects.create(firebase_uid=str(uuid4()))
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


class TestDeleteBoard(TestCase):
    def setUp(self):
        self.board = Board.objects.create(
            title='Foo', user=User.objects.create(firebase_uid=str(uuid4()))
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
            title='Foo', user=User.objects.create(firebase_uid=str(uuid4()))
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
        self.user = User.objects.create(
            firebase_uid=self.user_mock_firebase_uid
        )

    def test_create_board(self):
        r = self.client.post(
            self.create_board_endpoint,
            data=json.dumps({
                'title': self.board_title,
                'user': self.user.pk
            }),
            content_type='application/json'
        )

        board = Board.objects.get(title=self.board_title)

        self.assertTrue(isinstance(board, Board))
        self.assertTrue(isinstance(board.user, User))
        self.assertEqual(r.status_code, status.HTTP_201_CREATED)
        self.assertEqual(board.title, self.board_title)
