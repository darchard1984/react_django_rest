from uuid import uuid4

from django.test import TestCase

from ...models import User


class TestUserModel(TestCase):
    def setUp(self):
        self.user_mock_firebase_uid = str(uuid4())
        User.objects.create(firebase_uid=self.user_mock_firebase_uid)

    def test_user_model(self):
        user = User.objects.get(firebase_uid=self.user_mock_firebase_uid)

        self.assertTrue(isinstance(user, User))
        self.assertEqual(user.firebase_uid, self.user_mock_firebase_uid)
