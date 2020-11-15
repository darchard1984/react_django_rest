from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from api.serializers import UserSerializer


@api_view(['GET'])
def authenticate(request):
    """
        Authenticates user and responds with serialized
        authenticated user entity.
    """
    serialized = UserSerializer(request.user)
    response_data = serialized.data

    return Response(response_data, status=status.HTTP_200_OK)
