from django.test import TestCase

from ...models import Board, CardList, User
from .constants import MOCK_FIREBASE_UID


class TestCardListModel(TestCase):
    _board_title = 'Foo'
    _card_list_title = 'Bar'

    def setUp(self):
        user = User.objects.create(firebase_uid=MOCK_FIREBASE_UID)
        board = Board.objects.create(title=self._board_title, user=user)
        CardList.objects.create(title=self._card_list_title, board=board)

    def test_card_list_model(self):
        card_list = CardList.objects.get(title=self._card_list_title)

        self.assertTrue(isinstance(card_list, CardList))
        self.assertTrue(isinstance(card_list.board, Board))
        self.assertEqual(card_list.title, self._card_list_title)
        self.assertEqual(card_list.board.title, self._board_title)


class TestManyCardListsForBoard(TestCase):
    _board_title = 'Foo'

    def setUp(self):
        user = User.objects.create(firebase_uid=MOCK_FIREBASE_UID)
        board = Board.objects.create(title=self._board_title, user=user)

        card_lists = [
            CardList(title='Foo', board=board),
            CardList(title='Bar', board=board)
        ]
        CardList.objects.bulk_create(card_lists)

    def test_many_card_lists_for_board(self):
        card_lists = CardList.objects.filter(board__title=self._board_title)

        self.assertEqual(len(card_lists), 2)
