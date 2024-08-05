from rest_framework import serializers

class NotificationSerializer(serializers.Serializer):
    sender_username = serializers.CharField()
    receiver_username = serializers.CharField()
    fields = ['sender_username', 'receiver_username']
