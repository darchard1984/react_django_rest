from uuid import uuid4

from django.test import TestCase

from ...models import Board, Card, CardList, User


class TestCardModel(TestCase):
    def setUp(self):
        self.board_title = 'Foo'
        self.card_list_title = 'Bar'
        self.card_title = 'Card Title'
        self.card_description = 'Card description'
        self.card_position = 0
        self.user_mock_firebase_uid = str(uuid4())

        user = User.objects.create_user(
            firebase_uid=self.user_mock_firebase_uid
        )
        board = Board.objects.create(title=self.board_title, user=user)
        card_list = CardList.objects.create(
            title=self.card_list_title, board=board
        )
        Card.objects.create(
            title=self.card_title,
            description=self.card_description,
            card_list=card_list,
            position=self.card_position
        )

    def test_card_model(self):
        card = Card.objects.get(title=self.card_title)

        self.assertTrue(isinstance(card, Card))
        self.assertTrue(isinstance(card.card_list, CardList))
        self.assertEqual(card.title, self.card_title)
        self.assertEqual(card.description, self.card_description)
        self.assertEqual(card.position, self.card_position)
        self.assertEqual(card.card_list.title, self.card_list_title)


class TestManyCardsForCardList(TestCase):
    def setUp(self):
        self.card_list_title = 'Foo'
        self.user_mock_firebase_uid = str(uuid4())

        user = User.objects.create_user(
            firebase_uid=self.user_mock_firebase_uid
        )
        board = Board.objects.create(title='Foo', user=user)
        card_list = CardList.objects.create(
            title=self.card_list_title, board=board
        )

        cards = [
            Card(
                title='Foo',
                description='Some description',
                position=0,
                card_list=card_list
            ),
            Card(
                title='Bar',
                description='Another description',
                position=0,
                card_list=card_list
            )
        ]
        Card.objects.bulk_create(cards)

    def test_many_cards_for_card_list(self):
        cards = Card.objects.filter(card_list__title=self.card_list_title)

        self.assertEqual(len(cards), 2)
