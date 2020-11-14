from uuid import uuid4

from django.test import TestCase

from ...models import User


class TestCustomUserManager(TestCase):
    def test_create_user(self):
        mock_firebase_uid = str(uuid4())
        user = User(firebase_uid=mock_firebase_uid)
        User.objects.create_user(user)

        self.assertEqual(mock_firebase_uid, user.firebase_uid)
        with self.assertRaises(AttributeError):
            user.email
        with self.assertRaises(AttributeError):
            user.username
        with self.assertRaises(ValueError):
            User.objects.create_user(firebase_uid=None)
