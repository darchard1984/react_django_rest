import uuid

from django.test import TestCase

from ...models import Board, User
from .constants import MOCK_FIREBASE_UID


class TestBoardModel(TestCase):
    _board_title = 'Foo'

    def setUp(self):
        Board.objects.create(
            title=self._board_title,
            user=User.objects.create(firebase_uid=MOCK_FIREBASE_UID)
        )

    def test_board_model(self):
        board = Board.objects.get(title=self._board_title)

        self.assertTrue(isinstance(board, Board))
        self.assertTrue(isinstance(board.user, User))
        self.assertEqual(board.title, self._board_title)
        self.assertEqual(board.user.firebase_uid, MOCK_FIREBASE_UID)


class TestManyBoardsForUser(TestCase):
    _user_mock_firebase_uid = str(uuid.uuid4())

    def setUp(self):
        user = User.objects.create(firebase_uid=self._user_mock_firebase_uid)
        boards = [Board(title='Foo', user=user), Board(title='Bar', user=user)]

        Board.objects.bulk_create(boards)

    def test_many_board_models_for_user(self):
        boards = Board.objects.filter(
            user__firebase_uid=self._user_mock_firebase_uid
        )

        self.assertEqual(len(boards), 2)
