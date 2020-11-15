import json
from uuid import uuid4

import pytest
from django.test import Client, TestCase
from django.urls import reverse
from mock import Mock, patch
from rest_framework import status

from ...models import Board, User
from ...serializers import UserSerializer


@pytest.fixture(scope='module', autouse=True)
def patch_authentication():
    with patch(
        'firebase_auth.firebase_authentication.FirebaseAuthentication.authenticate',
        return_value=(Mock(), None)
    ):
        yield


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
        self.get_user_endpoint = reverse(
            'get_user', kwargs={'pk': self.user.pk}
        )

    def test_get_user(self):
        r = self.client.get(self.get_user_endpoint)

        expected = UserSerializer(self.user)

        self.assertEqual(r.status_code, status.HTTP_200_OK)
        self.assertEqual(r.data, expected.data)
        self.assertEqual(len(r.data.get('boards')), 2)
