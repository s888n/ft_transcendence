from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
import json
import asyncio
from .game import LocalGameManager, OnlineGameManager
from .models import Match, LocalMatch
from users.models import User
from .serializers import LocalMatchSerializer
import json

class LocalGameConsumer(AsyncWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        self.game_manager = LocalGameManager()
        super().__init__(*args, **kwargs)

    async def connect(self):
        self.user = self.scope["user"]
        await self.accept()
        self.game_loop_task = asyncio.create_task(self.game_loop())

    async def disconnect(self, close_code):
        self.game_loop_task.cancel()
        state = self.game_manager.game_result()

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        self.game_manager.receive(text_data_json)

    def save_match(self, result):
        LocalMatch.objects.create(
            creator=User.objects.get(username=self.user.username),
            player1=result["player1"],
            player2=result["player2"],
            player1_score=result["score"]["player1"],
            player2_score=result["score"]["player2"],
            mode=result["mode"],
            winner=result["winner"],
            finished=True,
        )

    async def game_loop(self):
        while True:
            if not self.game_manager.paused:
                self.game_manager.update()
            state = self.game_manager.game_state()
            await self.send(text_data=json.dumps(state))
            await asyncio.sleep(1 / 60)
            if state["state"] == "gameover":
                break
        result = self.game_manager.game_result()
        await self.send(text_data=json.dumps(result))
        await database_sync_to_async(self.save_match)(result)
        await self.close()


class OnlineGameConsumer(AsyncWebsocketConsumer):
    rooms = {}

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    async def connect(self):
        self.room = None
        await self.channel_layer.group_add("loby", self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard("loby", self.channel_name)
        if self.room in self.rooms and "game_loop_task" in self.rooms[self.room]:
            self.rooms[self.room]["game_loop_task"].cancel()
            if self.rooms[self.room]["game_manager"].game_state()["state"] != "gameover":
                await self.channel_layer.group_send(
                self.room, {"type": "game_state", "state":{
                    'type': 'game_state',
                    'state': 'disconnected',
                    'message': 'Opponent disconnected',
                    'mode': 'online'
                }}
            )

            # self.rooms[self.room]["game_manager"] = None
        if len(self.rooms[self.room]["players"]) == 1:
            del self.rooms[self.room]
        else:
            if self.channel_name in self.rooms[self.room]["players"]:
                self.rooms[self.room]["players"].remove(self.channel_name)

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        type = text_data_json.get("type")
        if type == "join":
            await self.event_handler(text_data_json)
        else:
            if self.room:
                self.rooms[self.room]["game_manager"].receive(text_data_json)

    async def event_handler(self, data):
        self.room = data.get("room_id")
        await self.channel_layer.group_add(self.room, self.channel_name)
        if self.room not in self.rooms:
            await self.create_game()
        else:
            await self.join_game()

    async def create_game(self):
        self.rooms[self.room] = {
            "players": [self.channel_name],
        }

    async def join_game(self):
        if len(self.rooms[self.room]["players"]) > 1:
            await self.send(text_data=json.dumps({"error": "Room is full"}))
            return
        self.rooms[self.room]["players"].append(self.channel_name)
        self.rooms[self.room]["game_manager"] = OnlineGameManager()
        await database_sync_to_async(self.rooms[self.room]["game_manager"].get_match)(
            self.room
        )
        self.rooms[self.room]["game_loop_task"] = asyncio.create_task(self.game_loop())

    async def game_loop(self):
        while True:
            if not self.rooms[self.room]["game_manager"].paused:
                self.rooms[self.room]["game_manager"].update()
            state = self.rooms[self.room]["game_manager"].game_state()
            await self.channel_layer.group_send(
                self.room, {"type": "game_state", "state": state}
            )
            await asyncio.sleep(1 / 60)
            if state["state"] == "gameover":
                break
        result = self.rooms[self.room]["game_manager"].game_result()
        await self.channel_layer.group_send(
            self.room, {"type": "game_result", "result": result}
        )

    async def game_state(self, event):
        await self.send(text_data=json.dumps(event["state"]))
        # if event["state"]["state"] == "gameover":
        #     await self.close()

    async def game_result(self, event):
        await self.send(text_data=json.dumps(event["result"]))
        await self.close()


# class OnlineGameConsumer(AsyncWebsocketConsumer):
#     rooms = {}

#     def __init__(self, *args, **kwargs):
#         super().__init__(*args, **kwargs)

#     async def connect(self):
#         self.room = None
#         await self.channel_layer.group_add("lobby", self.channel_name)
#         await self.accept()

#     async def disconnect(self, close_code):
#         await self.channel_layer.group_discard("lobby", self.channel_name)
#         if self.room in self.rooms and "game_loop_task" in self.rooms[self.room]:
#             self.rooms[self.room]["game_loop_task"].cancel()
#         if self.room in self.rooms and len(self.rooms[self.room]["players"]) == 1:
#             del self.rooms[self.room]
#         else:
#             if self.room in self.rooms and self.channel_name in self.rooms[self.room]["players"]:
#                 self.rooms[self.room]["players"].remove(self.channel_name)

#     async def receive(self, text_data):
#         text_data_json = json.loads(text_data)
#         type = text_data_json.get("type")
#         if type == "join":
#             await self.event_handler(text_data_json)
#         else:
#             if self.room and self.room in self.rooms and "game_manager" in self.rooms[self.room]:
#                 self.rooms[self.room]["game_manager"].receive(text_data_json)

#     async def event_handler(self, data):
#         self.room = data.get("room_id")
#         await self.channel_layer.group_add(self.room, self.channel_name)
#         if self.room not in self.rooms:
#             await self.create_game()
#         else:
#             await self.join_game()

#     async def create_game(self):
#         if self.room:
#             self.rooms[self.room] = {
#                 "players": [self.channel_name],
#             }
#             self.rooms[self.room]["game_manager"] = OnlineGameManager()
#             await database_sync_to_async(self.rooms[self.room]["game_manager"].create_match)(
#                 self.room
#             )
#             await self.send(text_data=json.dumps({"message": "Waiting for opponent"}))
#             self.rooms[self.room]["game_loop_task"] = asyncio.create_task(self.game_loop())

#     async def join_game(self):
#         if self.room and self.room in self.rooms and len(self.rooms[self.room]["players"]) > 1:
#             await self.send(text_data=json.dumps({"error": "Room is full"}))
#             return
#         if self.room and self.room in self.rooms:
#             self.rooms[self.room]["players"].append(self.channel_name)
#             self.rooms[self.room]["game_manager"] = OnlineGameManager()
#             await database_sync_to_async(self.rooms[self.room]["game_manager"].get_match)(
#                 self.room
#             )
#             self.rooms[self.room]["game_loop_task"] = asyncio.create_task(self.game_loop())

#     async def game_loop(self):
#         if self.room and self.room in self.rooms and "game_manager" in self.rooms[self.room]:
#             while True:
#                 if not self.rooms[self.room]["game_manager"].paused:
#                     self.rooms[self.room]["game_manager"].update()
#                 state = self.rooms[self.room]["game_manager"].game_state()
#                 await self.channel_layer.group_send(
#                     self.room, {"type": "game_state", "state": state}
#                 )
#                 await asyncio.sleep(1 / 60)
#                 if state["state"] == "gameover":
#                     break
#             result = self.rooms[self.room]["game_manager"].game_result()
#             await self.channel_layer.group_send(
#                 self.room, {"type": "game_result", "result": result}
#             )

#     async def game_state(self, event):
#         await self.send(text_data=json.dumps(event["state"]))

#     async def game_result(self, event):
#         await self.send(text_data=json.dumps(event["result"]))
#         await self.close()
