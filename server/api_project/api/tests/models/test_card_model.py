from django.test import TestCase

from ...models import Board, Card, CardList, User
from .constants import MOCK_FIREBASE_UID


class TestCardModel(TestCase):
    _board_title = 'Foo'
    _card_list_title = 'Bar'
    _card_title = 'Card Title'
    _card_description = 'Card description'
    _card_position = 0

    def setUp(self):
        user = User.objects.create(firebase_uid=MOCK_FIREBASE_UID)
        board = Board.objects.create(title=self._board_title, user=user)
        card_list = CardList.objects.create(
            title=self._card_list_title, board=board
        )
        Card.objects.create(
            title=self._card_title,
            description=self._card_description,
            card_list=card_list,
            position=self._card_position
        )

    def test_card_model(self):
        card = Card.objects.get(title=self._card_title)

        self.assertTrue(isinstance(card, Card))
        self.assertTrue(isinstance(card.card_list, CardList))
        self.assertEqual(card.title, self._card_title)
        self.assertEqual(card.description, self._card_description)
        self.assertEqual(card.position, self._card_position)
        self.assertEqual(card.card_list.title, self._card_list_title)


class TestManyCardsForCardList(TestCase):
    _card_list_title = 'Foo'

    def setUp(self):
        user = User.objects.create(firebase_uid=MOCK_FIREBASE_UID)
        board = Board.objects.create(title='Foo', user=user)
        card_list = CardList.objects.create(
            title=self._card_list_title, board=board
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
        cards = Card.objects.filter(card_list__title=self._card_list_title)

        self.assertEqual(len(cards), 2)
