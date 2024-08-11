import json

from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from django.utils import timezone
from asgiref.sync import sync_to_async
from django.db import transaction
from notifications.consumers import NotificationConsumer

from .models import ChatRoom, Message
from users.models import User


class PrivateChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.sender_id = self.scope['user'].id

        self.room_group_name = f'chat_private_{self.sender_id}'

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        try:
            data_json = json.loads(text_data)
            chatroom_id = data_json.get('chatroom_id')
            receiver_id = data_json.get('receiver_id')
     
            if chatroom_id is None or receiver_id is None or self.sender_id == receiver_id:
                return
        
            chat_room = await self.get_or_create_chatroom(receiver_id)
            if chat_room is None:
                await self.send(text_data=json.dumps({
                    "type" : "Chatroom not found" 
                }, ensure_ascii=False))
                return
    
            if (data_json.get('type') == 'read'):
                await self.read(data_json)
                return
            if (data_json.get('type') == 'message'):
                group_name = f'chat_private_{receiver_id}'
                result = await self.new_message(data_json, chat_room)
                if result is not None:
                    await self.channel_layer.group_send(group_name, result)
                    await self.channel_layer.group_send(self.room_group_name, result)
                    await NotificationConsumer.send_notification(self, receiver_id, self.sender_id, 'message')

            if (data_json.get('type') == 'get_online_status'):
                status = await self.get_online_status(receiver_id)
                await self.send(text_data=json.dumps({
                    "type": "online_status",
                    "status": status,
                }, ensure_ascii=False))

        except KeyError:
            pass
    
    @database_sync_to_async
    def get_or_create_chatroom(self, receiver_id):
        sorted_ids = sorted([self.sender_id, receiver_id])

        try:
            user1 = User.objects.get(id=sorted_ids[0])
            user2 = User.objects.get(id=sorted_ids[1])
            chatroom = ChatRoom.objects.get(user1=user1, user2=user2)
            return chatroom
        except:
            return None
        
    async def private_message(self, event):
        user_id = event['sender_id']
        message = event['message']
        time = event['time']
        chatroom_id = event['chatroom_id']
        receiver_id = event['receiver_id']

        await self.send(text_data=json.dumps({
                "sender_id": user_id,
                "receiver_id": receiver_id,
                "message": message,
                "created_at": time,
                "chatroom_id": chatroom_id,
                "type": "private.message",
            }, ensure_ascii=False))
        
    async def read(self, event):
        receiver_id = event['receiver_id']

        chatroom = await self.get_or_create_chatroom(receiver_id)
        if chatroom is not None:
          last_sender = await sync_to_async(lambda: chatroom.last_sender.id)()

          if (last_sender != self.sender_id):
                await self.reset_unread_count(chatroom)


    @database_sync_to_async
    def reset_unread_count(self, chatroom):
        chatroom.unread_count = 0
        chatroom.save()
        return


    @database_sync_to_async
    def new_message(self, data_json, chatroom):
        user_id = self.sender_id
        message = data_json['message']
        receiver_id = data_json['receiver_id']

        try:
            user = User.objects.get(id=user_id)
            if chatroom.user1 != user and chatroom.user2 != user:
                return
            new_message = Message.objects.create(
                chatroom=chatroom,
                sender=user,
                message=message,
            )
            formatted_date = new_message.created_at.strftime('%Y-%m-%d %H:%M:%S')
            chatroom.last_message = message
            chatroom.last_send_time = new_message.created_at
            if chatroom.last_sender == user:
            # Increment the unread count by 1
                chatroom.unread_count += 1
            else:
                chatroom.last_sender = user
                chatroom.unread_count = 1

            chatroom.save()
            new_message.save()
            
            return {
                "type": "private.message",
                "sender_id": user_id,
                "chatroom_id": chatroom.id,
                "receiver_id": receiver_id,
                "message": message,
                "time": formatted_date,
            }
        except User.DoesNotExist:
            pass
        except ChatRoom.DoesNotExist:
            pass


    @database_sync_to_async
    def get_username(self, receiver_id):
        return User.objects.get(id=receiver_id).username
    

    async def get_online_status(self, user_id):
        return await NotificationConsumer.get_online_status(self, user_id)