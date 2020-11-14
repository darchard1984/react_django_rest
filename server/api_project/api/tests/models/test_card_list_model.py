from uuid import uuid4

from django.test import TestCase

from ...models import Board, CardList, User


class TestCardListModel(TestCase):
    def setUp(self):
        self.board_title = 'Foo'
        self.card_list_title = 'Bar'
        self.user_mock_firebase_uid = str(uuid4())

        user = User.objects.create_user(
            firebase_uid=self.user_mock_firebase_uid
        )
        board = Board.objects.create(title=self.board_title, user=user)
        CardList.objects.create(title=self.card_list_title, board=board)

    def test_card_list_model(self):
        card_list = CardList.objects.get(title=self.card_list_title)

        self.assertTrue(isinstance(card_list, CardList))
        self.assertTrue(isinstance(card_list.board, Board))
        self.assertEqual(card_list.title, self.card_list_title)
        self.assertEqual(card_list.board.title, self.board_title)


class TestManyCardListsForBoard(TestCase):
    def setUp(self):
        self.board_title = 'Foo'
        self.user_mock_firebase_uid = str(uuid4())

        user = User.objects.create_user(
            firebase_uid=self.user_mock_firebase_uid
        )
        board = Board.objects.create(title=self.board_title, user=user)

        card_lists = [
            CardList(title='Foo', board=board),
            CardList(title='Bar', board=board)
        ]
        CardList.objects.bulk_create(card_lists)

    def test_many_card_lists_for_board(self):
        card_lists = CardList.objects.filter(board__title=self.board_title)

        self.assertEqual(len(card_lists), 2)
