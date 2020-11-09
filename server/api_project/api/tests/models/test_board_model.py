import uuid
from uuid import uuid4

from django.test import TestCase

from ...models import Board, User


class TestBoardModel(TestCase):
    def setUp(self):
        self.board_title = 'Foo'
        self.user_mock_firebase_uid = str(uuid4())

        Board.objects.create(
            title=self.board_title,
            user=User.objects.create(firebase_uid=self.user_mock_firebase_uid)
        )

    def test_board_model(self):
        board = Board.objects.get(title=self.board_title)

        self.assertTrue(isinstance(board, Board))
        self.assertTrue(isinstance(board.user, User))
        self.assertEqual(board.title, self.board_title)
        self.assertEqual(board.user.firebase_uid, self.user_mock_firebase_uid)


class TestManyBoardsForUser(TestCase):
    def setUp(self):
        self.user_mock_firebase_uid = str(uuid.uuid4())

        user = User.objects.create(firebase_uid=self.user_mock_firebase_uid)
        boards = [Board(title='Foo', user=user), Board(title='Bar', user=user)]

        Board.objects.bulk_create(boards)

    def test_many_board_models_for_user(self):
        boards = Board.objects.filter(
            user__firebase_uid=self.user_mock_firebase_uid
        )

        self.assertEqual(len(boards), 2)
