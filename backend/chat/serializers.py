from rest_framework import serializers

from .models import ChatRoom, Message

class ChatRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatRoom
        fields = ['id', 'user1', 'user1_username', 'user1_avatar', 'user2', 'user2_username', 'user2_avatar', 'last_sender', 'unread_count', 'last_send_time', 'last_message' ]
        read_only_fields = ['id', 'user1', 'user2', 'created_at', 'updated_at']

    user1_username = serializers.CharField(source='user1.username', read_only=True)
    user1_avatar = serializers.CharField(source='user1.avatar', read_only=True)
    user2_username = serializers.CharField(source='user2.username', read_only=True)
    user2_avatar = serializers.CharField(source='user2.avatar', read_only=True)
    last_message = serializers.CharField(read_only=True)

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        sender_id = serializers.IntegerField(source='last_sender.id', read_only=True)
        fields = ['id', 'chatroom', 'sender_id', 'message', 'created_at' , 'sender']
        read_only_fields = ['id', 'chatroom', 'sender', 'message', 'created_at' , 'sender_id']