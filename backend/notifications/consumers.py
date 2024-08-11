from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from users.models import User

import json

connected = 0

OnlineUsers = {}


class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        user = self.scope["user"]
        username = self.scope["user"].username
        self.group_name = f"notifications_{username}"
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()
        await self.update_status(user.id, True)
        OnlineUsers[user.id] = self.channel_name

        global connected
        connected += 1

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)
        await self.update_status(self.scope["user"].id, False)
        await self.close()
        global connected
        connected -= 1
        OnlineUsers.pop(self.scope["user"].id)

    async def receive(self, text_data):
        await self.send(text_data)

    async def send_invite(self, event):
        sender = event["sender"]
        receiver = event["receiver"]
        await self.send(
            text_data=json.dumps(
                {
                    "type": "game_invite",
                    "sender": sender,
                    "receiver": receiver,
                    "message": f"{sender} sent you a game invite",
                    "connnected": f"{connected}",
                }
            )
        )

    async def accept_invite(self, event):
        sender = event.get("sender")
        receiver = event.get("receiver")
        match_id = event.get("match_id")
        await self.send(
            text_data=json.dumps(
                {
                    "type": "game_accepted",
                    "sender": sender,
                    "receiver": receiver,
                    "message": f"{receiver} accepted your game invite",
                    "id": match_id,
                }
            )
        )

    async def send_notification(self, receiver_id, sender_id, type):
        group_name = await self.get_username(receiver_id)
        sender = await self.get_username(sender_id)
        await self.channel_layer.group_send(
            f"notifications_{group_name}",
            {
                "sender_id": sender_id,
                "type": type,
                "message": f"New {type} from {sender}",
            },
        )

    async def message(self, event):
        await self.send(text_data=json.dumps(event))

    @database_sync_to_async
    def update_status(self, user_id, status):
        user = User.objects.get(id=user_id)
        user.is_online = status
        user.save()

    async def get_online_status(self, user_id):
        user_id = int(user_id)
        return user_id in OnlineUsers

    async def block(self, event):
        await self.send(text_data=json.dumps(event))

    async def friend_request(self, event):
        sender = event.get("sender")
        receiver = event.get("receiver")
        if receiver and sender:
            await self.send(
                text_data=json.dumps(
                    {
                        "type": "friend_request",
                        "sender": sender,
                    }
                )
            )
