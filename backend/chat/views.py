from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.db.models import Q
from .models import ChatRoom, Message
from .serializers import ChatRoomSerializer, MessageSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import CursorPagination
from rest_framework.parsers import JSONParser
from rest_framework.decorators import parser_classes



@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
@parser_classes([JSONParser])
def chat_room_list(request):
    if request.method == 'GET':
        user_id = request.user.id
        chat_rooms = ChatRoom.objects.filter(Q(user1_id=user_id) | Q(user2_id=user_id)).order_by('-last_send_time')
        serializer = ChatRoomSerializer(chat_rooms, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
@parser_classes([JSONParser])
def message_list(request, chatroom_id):
    if request.method == 'GET':
        messages = Message.objects.filter(chatroom_id=chatroom_id)
        paginator = CustomPagination()
        paginated_messages = paginator.paginate_queryset(messages, request)
        serializer = MessageSerializer(paginated_messages, many=True)
        return paginator.get_paginated_response(serializer.data)

class CustomPagination(CursorPagination):
    page_size = 17
    ordering = '-created_at'


