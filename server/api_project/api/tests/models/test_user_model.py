from django.test import TestCase

from ...models import User
from .constants import MOCK_FIREBASE_UID


class TestUserModel(TestCase):
    def setUp(self):
        User.objects.create(firebase_uid=MOCK_FIREBASE_UID)

    def test_user_model(self):
        user = User.objects.get(firebase_uid=MOCK_FIREBASE_UID)

        self.assertTrue(isinstance(user, User))
        self.assertEqual(user.firebase_uid, MOCK_FIREBASE_UID)
