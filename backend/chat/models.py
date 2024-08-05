from django.db import models
from users.models import User
from backend.models import TimestampBaseModel

class ChatRoom(TimestampBaseModel):
    user1 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user1_chat_room')
    user2 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user2_chat_room')
    last_sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='last_sent_chat_room')
    last_send_time = models.DateTimeField(blank=True, null=True)
    last_message = models.CharField(max_length=100, blank=True, null=True)
    unread_count = models.IntegerField(default=0)


    class Meta:
        db_table = "chat_room"

    def __str__(self):
        return f"ChatRoom {self.id}"

class Message(TimestampBaseModel):
    chatroom = models.ForeignKey(ChatRoom, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    message = models.CharField(max_length=100)

    class Meta:
        db_table = "message"

    def __str__(self):
            return f"Send by {self.sender.nickname}" 

  
