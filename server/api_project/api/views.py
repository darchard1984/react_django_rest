from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import User
from .serializers import UserSerializer


@api_view(['GET', 'DELETE', 'PUT'])
def get_delete_update_user(request, pk):
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serialized_user = UserSerializer(user)
        return Response(serialized_user.data)

    elif request.method == 'DELETE':
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    elif request.method == 'PUT':
        serialized_user = UserSerializer(user, data=request.data)
        if serialized_user.is_valid():
            serialized_user.save()
            return Response(
                serialized_user.data, status=status.HTTP_204_NO_CONTENT
            )
        return Response(
            serialized_user.errors, status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['POST'])
def create_user(request):
    user_data = {
        'firebase_uid': request.data.get('firebase_uid')
    }
    serialized_user = UserSerializer(data=user_data)
    if serialized_user.is_valid():
        serialized_user.save()
        return Response(serialized_user.data, status=status.HTTP_201_CREATED)

    return Response(
        serialized_user.errors, status=status.HTTP_400_BAD_REQUEST
    )
