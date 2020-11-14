import json
from uuid import uuid4

from django.test import Client, TestCase
from django.urls import reverse
from rest_framework import status

from ...models import Board, User
from ...serializers import UserSerializer


class TestGetUser(TestCase):
    def setUp(self):
        self.user_uid = str(uuid4())
        self.user = User.objects.create_user(firebase_uid=self.user_uid)

        Board.objects.bulk_create(
            [
                Board(title='Foo', user=self.user),
                Board(title='Bar', user=self.user),
            ]
        )

        self.client = Client()
        self.get_delete_update_endpoint = reverse(
            'get_delete_update_user', kwargs={'pk': self.user.pk}
        )

    def test_get_user(self):
        r = self.client.get(self.get_delete_update_endpoint)

        expected = UserSerializer(self.user)

        self.assertEqual(r.status_code, status.HTTP_200_OK)
        self.assertEqual(r.data, expected.data)
        self.assertEqual(len(r.data.get('boards')), 2)


class TestDeleteUser(TestCase):
    def setUp(self):
        self.user_uid = str(uuid4())
        self.user = User.objects.create_user(firebase_uid=self.user_uid)

        self.client = Client()
        self.get_delete_update_endpoint = reverse(
            'get_delete_update_user', kwargs={'pk': self.user.pk}
        )

    def test_delete_user(self):
        r = self.client.delete(self.get_delete_update_endpoint)

        self.assertEqual(r.status_code, status.HTTP_204_NO_CONTENT)


class TestPutUser(TestCase):
    def setUp(self):
        self.user_uid = str(uuid4())
        self.user = User.objects.create_user(firebase_uid=self.user_uid)

        self.client = Client()
        self.get_delete_update_endpoint = reverse(
            'get_delete_update_user', kwargs={'pk': self.user.pk}
        )

        self.valid_data = {'firebase_uid': 'foo'}

        self.invalid_data = {'this_is_invalid': 'bar'}

    def test_update_user(self):
        r = self.client.put(
            self.get_delete_update_endpoint,
            kwargs={'pk': self.user.pk},
            data=json.dumps(self.valid_data),
            content_type='application/json'
        )

        updated_firebase_uid = User.objects.get(pk=self.user.pk).firebase_uid

        self.assertEqual(r.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(
            updated_firebase_uid, self.valid_data.get('firebase_uid')
        )

    def test_invalid_user_update(self):
        r = self.client.put(
            self.get_delete_update_endpoint,
            kwargs={'pk': self.user.pk},
            data=json.dumps(self.invalid_data),
            content_type='application/json'
        )

        self.assertEqual(r.status_code, status.HTTP_400_BAD_REQUEST)


class TestCreateUser(TestCase):
    def setUp(self):
        self.client = Client()
        self.create_user_endpoint = reverse('create_user')
        self.user_uid = str(uuid4())

    def test_create_user(self):
        r = self.client.post(
            self.create_user_endpoint,
            data=json.dumps({'firebase_uid': self.user_uid}),
            content_type='application/json'
        )

        user = User.objects.get(firebase_uid=self.user_uid)

        self.assertEqual(r.status_code, status.HTTP_201_CREATED)
        self.assertTrue(isinstance(user, User))
        self.assertEqual(user.firebase_uid, self.user_uid)
