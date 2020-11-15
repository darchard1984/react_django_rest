from uuid import uuid4

from django.test import Client, TestCase
from django.urls import reverse
from mock import Mock, patch
from rest_framework import status

from api.models import Board, User
from api.serializers import UserSerializer


class TestAuthenticate(TestCase):
    def setUp(self):
        self.client = Client()
        self.auth_endpoint = reverse('authenticate')
        self.user = User.objects.create(firebase_uid=str(uuid4()))

    def test_authenticated_user(self):
        with patch(
            'firebase_auth.firebase_authentication.FirebaseAuthentication.authenticate',
            Mock(return_value=(self.user, None))
        ):
            r = self.client.get(self.auth_endpoint)

            expected = UserSerializer(self.user)

            self.assertEqual(r.status_code, status.HTTP_200_OK)
            self.assertEqual(r.data, expected.data)
