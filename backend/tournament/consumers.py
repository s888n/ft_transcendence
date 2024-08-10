from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
import json
import asyncio
from .models import Tournament, TournamentMatch
from .serializers import TournamentSerializer, TournamentMatchSerializer
from game.game import Ball, Paddle
from asgiref.sync import sync_to_async


# 1 - fetch the data tournament from the database
# 2 - send the tournament data to the client
# 3 - if the user is the creator of the tournament, start the tournament manager
# 4 - check if the tournament is finished
# 5 - get the next match
# 6 - send the current match to the client
# 7 - create a game manager for the match
# 8 - send the game state to the client
# 9 - update the game state
# 10 - if the game is over, send the game result to the client
# 11 - update the tournament data
# 12 - add the winner to the next match in the next round if there is one
# 13 - send the updated tournament data to the client
# 14 - repeat steps 6 to 13 until the tournament is finished
# 15 - send the tournament results to the client
# 16 - close the connection


class TournamentConsumer(AsyncWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.tournament_id = None
        self.tournament_task = None
        self.tournament = None
        self.game_manager = None

    async def connect(self):
        self.user = self.scope["user"]
        self.tournament_id = self.scope["url_route"]["kwargs"]["id"]

        self.tournament = await database_sync_to_async(self.get_tournament)(
            self.tournament_id
        )
        await self.accept()
        if self.tournament == None or self.user.id != self.tournament["creator"]:
            await self.send_tournament_error()
            await self.close()
            return
        await self.send_tournament_info()
        self.tournament_task = asyncio.create_task(self.tournament_manager())

    async def disconnect(self, close_code):
        if self.tournament_task:
            self.tournament_task.cancel()

    async def receive(self, text_data):
        data = json.loads(text_data)
        if self.game_manager:
            self.game_manager.receive(data)

    async def send_tournament_error(self):
        await self.send(
            text_data=json.dumps(
                {
                    "type": "tournament_error",
                    "message": "Tournament not found",
                }
            )
        )

    async def send_tournament_info(self):
        await self.send(
            text_data=json.dumps(
                {
                    "type": "tournament_info",
                    "info": self.tournament,
                }
            )
        )

    async def send_current_match(self, match):
        await self.send(
            text_data=json.dumps(
                {
                    "type": "tournament_match",
                    "match": match,
                }
            )
        )

    def get_tournament(self, tournament_id):
        tournament = None
        try:
            tournament = TournamentSerializer(
                Tournament.objects.get(id=tournament_id)
            ).data
            return tournament
        except Tournament.DoesNotExist:
            return None

    async def send_tournament_results(self):
        await self.send(
            text_data=json.dumps(
                {
                    "type": "tournament_result",
                    "tournament": self.tournament,
                }
            )
        )

    def get_next_match(self):
        matches = self.tournament["matches"]
        for match in matches:
            if match["winner"] == None:
                return match
        return None

    def get_next_round_match(self):
        matches = self.tournament["matches"]
        for match in matches:
            if match["winner"] == None and (
                match["player1"] == None or match["player2"] == None
            ):
                return match
        return None

    def update_tournament(self, result):
        next_round_match = self.get_next_round_match()
        if next_round_match:
            match = TournamentMatch.objects.get(id=next_round_match["id"])
            if next_round_match["player1"] == None:
                match.player1 = result["winner"]
                match.save()
                return
            if next_round_match["player2"] == None:
                match.player2 = result["winner"]
                match.save()
                return
        else:
            tournament = Tournament.objects.get(id=self.tournament_id)
            tournament.finished = True
            tournament.winner = result["winner"]
            tournament.save()
            return

    async def tournament_manager(self):
        while not self.tournament["finished"]:
            match = self.get_next_match()
            if match == None:
                await self.send_tournament_results()
                await self.close()
                return

            await self.send_current_match(match)
            self.game_manager = TournamentMatchManager(
                match["id"],
                match["player1"],
                match["player2"],
                match["score1"],
                match["score2"],
                match["winner"],
                match["finished"],
                match["round"],
            )
            while True:
                if not self.game_manager.paused:
                    self.game_manager.update()
                state = self.game_manager.game_state()
                await self.send(text_data=json.dumps(state))
                await asyncio.sleep(1 / 60)
                if state["state"] == "gameover":
                    break
            result = self.game_manager.game_result()
            # self.game_manager = None
            await self.send(text_data=json.dumps(result))
            await sync_to_async(self.update_tournament)(result)
            self.tournament = await sync_to_async(self.get_tournament)(
                self.tournament_id
            )
            await self.send_tournament_info()
        await self.send_tournament_results()
        await self.close()


class TournamentMatchManager:
    def __init__(
        self, match_id, player1, player2, score1, score2, winner, finished, round
    ):
        self.match_id = match_id
        self.player1 = player1
        self.player2 = player2
        self.score1 = score1
        self.score2 = score2
        self.winner = winner
        self.finished = finished
        self.round = round
        self.game = Game(player1, player2, score1, score2, finished, winner)
        self.paused = False

    def receive(self, message):
        event = message.get("event")

        if event == "START":
            if self.game.state == "waiting":
                self.game.start()

        if event == "MOVE":
            player_id = message.get("playerID")
            direction = message.get("direction")
            self.game.move_paddle(player_id, direction)

        if event == "PAUSE":
            if self.paused:
                self.unpause()
            else:
                self.pause()

    def pause(self):
        self.paused = True
        self.game.state = "paused"

    def unpause(self):
        self.paused = False
        self.game.state = "playing"

    def game_state(self):
        return self.game.get_state()

    def game_result(self):
        return {
            "type": "game_state",
            "state": "gameover",
            "id": self.match_id,
            "winner": self.game.winner,
            "score": {
                "player1": self.game.score[0],
                "player2": self.game.score[1],
            },
            "round": self.round,
        }

    def update(self):
        if self.game.state == "playing":
            self.game.update()
            if self.score1 != self.game.score[0] or self.score2 != self.game.score[1]:
                asyncio.create_task(sync_to_async(self.update_match)())
                self.score1 = self.game.score[0]
                self.score2 = self.game.score[1]

    def update_match(self):
        try:
            match = TournamentMatch.objects.get(id=self.match_id)
            match.score1 = self.game.score[0]
            match.score2 = self.game.score[1]
            if self.game.state == "gameover":
                match.winner = self.game.winner
                match.finished = True
            match.save()
        except Exception as e:
            print("Error updating match", e)

    def move_paddle(self, player_id, direction):
        self.game.move_paddle(player_id, direction)


class Game:
    def __init__(self, player1, player2, score1, score2, finished, winner):
        self.width = 6
        self.height = 12
        self.half_width = self.width / 2
        self.half_height = self.height / 2
        self.win_score = 5
        self.score = [score1, score2]
        self.ball = Ball()
        self.player1 = player1
        self.player2 = player2
        self.paddle1 = Paddle(0, 6)
        self.paddle2 = Paddle(0, -6)
        self.state = "gameover" if finished else "waiting"
        self.winner = winner

    def check_score(self):
        if self.ball.z > self.half_height:
            self.update_score(0, 1)
        elif self.ball.z < -self.height:
            self.update_score(1, 0)

    def reset(self, direction):
        self.ball.reset(direction)
        self.paddle1.center()
        self.paddle2.center()

    def update_score(self, id1, id2):
        self.score[id1] += 1
        self.reset(1 if id1 == 0 else -1)
        if self.score[id1] >= self.win_score:
            self.reset(0)
            self.winner = self.player1 if id1 == 0 else self.player2
            self.state = "gameover"

    def paddles_wall_collision(self):
        for paddle in [self.paddle1, self.paddle2]:
            if paddle.x + paddle.half_width > self.half_width:
                paddle.x = self.half_width - paddle.half_width
            if paddle.x - paddle.half_width < -self.half_width:
                paddle.x = -self.half_width + paddle.half_width

    def ball_wall_collision(self):
        if self.ball.x + self.ball.radius > self.half_width:
            self.ball.dx *= -1
            self.ball.x = self.half_width - self.ball.radius
            self.ball.speed = 0.1
        if self.ball.x - self.ball.radius < -self.half_width:
            self.ball.dx *= -1
            self.ball.x = -self.half_width + self.ball.radius
            self.ball.speed = 0.1

    def ball_paddle_collision(self):
        if self.ball.z < 0:
            paddle = self.paddle2
        else:
            paddle = self.paddle1
        if (abs(self.ball.z - paddle.z) < self.ball.radius + paddle.half_height) and (
            abs(self.ball.x - paddle.x) < self.ball.radius + paddle.half_width
        ):
            self.ball.dz *= -1
            self.ball.speed = min(self.ball.speed + 0.01, self.ball.max_speed)
            self.ball.dx = (self.ball.x - paddle.x) / 2

    def move_paddle(self, id, direction):
        if self.state != "playing":
            return
        if id == 1:
            self.paddle1.move(direction)
        elif id == 2:
            self.paddle2.move(direction)

    def start(self):
        self.state = "playing"

    def update(self):
        self.paddles_wall_collision()
        self.ball.update()
        self.ball_wall_collision()
        self.ball_paddle_collision()
        self.check_score()

    def get_state(self):
        return {
            "type": "game_state",
            "state": self.state,
            "ball": {
                "x": self.ball.x,
                "z": self.ball.z,
            },
            "paddle1": {
                "x": self.paddle1.x,
            },
            "paddle2": {
                "x": self.paddle2.x,
            },
            "score": {
                "player1": self.score[0],
                "player2": self.score[1],
            },
        }

    def gameover_state(self):
        return {
            "type": "game_state",
            "state": "gameover",
            "winner": self.winner,
            "score": {
                "player1": self.score[0],
                "player2": self.score[1],
            },
        }
