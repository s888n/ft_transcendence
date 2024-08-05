import jwt
from jwt import InvalidTokenError
from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response

from backend import settings
from users.models import User


def get_access_token(request):
    access_token = request.META.get('HTTP_AUTHORIZATION')
    if access_token is None:
        raise ValidationError('\'authorization\' is required')
    return access_token.replace('Bearer ', '', 1)


def decode_token(token):
    payload = jwt.decode(token, settings.SECRET_KEY, settings.SIMPLE_JWT['ALGORITHM'])
    user_id = payload.get('user_id')
    if user_id is None:
        raise ValidationError('Token has no user info')
    return user_id


def get_user(request):
    try:
        access_token = get_access_token(request)
        user_id = decode_token(access_token)
        user = User.objects.get(id=user_id)
    except ValidationError as e:
        return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    except InvalidTokenError:
        return Response({'message': 'Invalid or expired token'}, status=status.HTTP_400_BAD_REQUEST)
    except User.DoesNotExist:
        return Response({'message': 'Non-existent users'}, status=status.HTTP_404_NOT_FOUND)
    return user
