import random
import math
import time
from .models import Match
from .serializers import MatchSerializer
from channels.layers import get_channel_layer
from asgiref.sync import sync_to_async
from channels.db import database_sync_to_async
import asyncio
from users.models import User


class LocalGameManager:
    def __init__(self):
        self.game = GameEngine(0, 0)
        self.paused = False

    def receive(self, message):
        event = message.get("event")
        mode = message.get("type")
        # print("event", message)

        if event == "START":
            if self.game.state == "waiting":
                self.game.start(mode)

        if event == "MOVE":
            player_id = message.get("playerID")
            direction = message.get("direction")
            self.move_paddle(player_id, direction)

        if event == "PAUSE":
            if self.paused:
                self.unpause()
            else:
                self.pause()

    def move_paddle(self, id, direction):
        if self.game.state == "playing":
            self.game.move_paddle(id, direction)

    def game_state(self):
        return self.game.get_state()

    def game_result(self):
        return self.game.gameover_state()

    def winner(self):
        return self.game.winner()

    def update(self):
        if self.game.state == "playing":
            self.game.update()

    def player1_score(self):
        return self.game.score[0]

    def player2_score(self):
        return self.game.score[1]

    def pause(self):
        if self.game.state == "playing":
            self.paused = True
            self.game.state = "paused"

    def unpause(self):
        self.paused = False
        self.game.state = "playing"


class OnlineGameManager:
    def __init__(self):
        self.match_data = None
        self.player1 = None
        self.player2 = None
        self.game = None
        self.player1_ready = False
        self.player2_ready = False
        self.last_scores = [0, 0]
        self.paused = False
        self.player1_pauseCount = 0
        self.player2_pauseCount = 0

    # each player can pause the game 3 times for 15 seconds each time
    async def pause(self, username):
        if username == self.player1:
            self.player1_pauseCount += 1
            if self.player1_pauseCount < 3:
                # self.update_pauses()
                # asyncio.create_task(self.update_pauses())
                await sync_to_async(self.update_pauses)()
                self.paused = True
                self.game.state = "paused"
                await asyncio.sleep(15)
                self.game.state = "playing"
                self.paused = False
        elif username == self.player2:
            self.player2_pauseCount += 1
            if self.player2_pauseCount < 3:
                # self.update_pauses()
                # asyncio.create_task(self.update_pauses())
                await sync_to_async(self.update_pauses)()
                self.paused = True
                self.game.state = "paused"
                await asyncio.sleep(15)
                self.game.state = "playing"
                self.paused = False

    def get_match(self, id):
        self.match_data = MatchSerializer(Match.objects.get(id=id)).data
        self.player1 = self.match_data["player1"]["username"]
        self.player2 = self.match_data["player2"]["username"]
        self.player1_pauseCount = self.match_data["player1_pauses"]
        self.player2_pauseCount = self.match_data["player2_pauses"]
        self.game = GameEngine(
            self.match_data["player1_score"], self.match_data["player2_score"]
        )

    def receive(self, message):
        # print("event", message)
        event = message.get("event")
        mode = message.get("type")
        username = message.get("username")
        direction = message.get("direction", 0)
        if event == "START":
            if self.game.state == "waiting":
                if username == self.player1:
                    self.player1_ready = True
                elif username == self.player2:
                    self.player2_ready = True
                if self.player1_ready and self.player2_ready:
                    self.game.start(mode)
        if event == "MOVE":
            self.move_paddle(username, direction)
        if event == "PAUSE":
            if self.game.state == "playing":
                asyncio.create_task(self.pause(username))

    def move_paddle(self, username, direction):
        if username == self.player1:
            self.game.move_paddle(1, direction)
        elif username == self.player2:
            self.game.move_paddle(2, direction)

    def game_state(self):
        return self.game.get_state()

    def game_result(self):
        result =  self.game.gameover_state()
        return {
            "type": "game_state",
            "state": "gameover",
            "winner": self.player1 if result["winner"] == 0 else self.player2,
            "loser": self.player1 if result["loser"] == 0 else self.player2,
            "score": {
                "player1": self.player1_score(),
                "player2": self.player2_score(),
            },
        }

    def winner(self):
        return self.game.winner()

    def update(self):
        if self.match_data["finished"]:
            self.game.state = "gameover"
        if self.game.state == "playing":
            self.game.update()
            if (
                self.player1_score() != self.last_scores[0]
                or self.player2_score() != self.last_scores[1]
            ):
                asyncio.create_task(sync_to_async(self.update_match)())
                self.last_scores = [self.player1_score(), self.player2_score()]

    def player1_score(self):
        return self.game.score[0]

    def player2_score(self):
        return self.game.score[1]

    def update_pauses(self):
        try:
            match = Match.objects.get(id=self.match_data["id"])
            match.player1_pauses = self.player1_pauseCount
            match.player2_pauses = self.player2_pauseCount
            match.save()
        except Exception as e:
            print("Error updating match", e)

    def update_match(self):
        try:
            match = Match.objects.get(id=self.match_data["id"])
            match.player1_score = self.game.score[0]
            match.player2_score = self.game.score[1]
            if self.game.state == "gameover" and not match.finished:
                match.finished = True
                if self.game.winner_id == 0:
                    match.winner = User.objects.get(username=self.player1)
                elif self.game.winner_id == 1:
                    match.winner = User.objects.get(username=self.player2)
            match.save()
        except Exception as e:
            print("Error updating match", e)


class Ball:
    def __init__(self):
        self.radius = 0.1
        self.x = 0
        self.z = 0
        self.dx = 0
        self.dz = random.choice([-1, 1])
        self.speed = 0.1
        self.max_speed = 0.15
        self.wait = 60

    def update_x(self):
        self.x += self.dx * self.speed

    def update_z(self):
        self.z += self.dz * self.speed

    def update(self):
        if self.wait > 0:
            self.wait -= 1
        else:
            self.update_x()
            self.update_z()

    def reset(self, direction):
        self.x = 0
        self.z = 0
        self.dx = 0
        self.dz = direction
        self.speed = 0.1
        self.wait = 120


class Paddle:
    def __init__(self, x, z):
        self.width = 0.8
        self.height = 0.1
        self.half_width = self.width / 2
        self.half_height = self.height / 2
        self.x = x
        self.z = z
        self.speed = 0.08

    def move(self, direction):
        self.x += direction * self.speed

    def center(self):
        self.x = 0


class AI:
    def __init__(
        self,
        bx,
        bz,
        b_dx,
        b_dz,
        p1x,
        p2x,
        width,
        height,
        paddle_width,
        paddle_speed,
        half_width,
    ):
        self.ball_x = bx
        self.ball_z = bz
        self.ball_dx = b_dx
        self.ball_dz = b_dz
        self.paddle1_x = p1x
        self.paddle2_x = p2x
        self.last_update = time.time()
        self.game_width = width
        self.game_height = height
        self.paddle_width = paddle_width
        self.paddle_speed = paddle_speed
        self.half_width = half_width

    # minmax algorithm with alpha-beta pruning

    def calculate_ai_move(self):
        # if self.ball_z > 0:
        #     return 0
        # Initialize alpha and beta to negative and positive infinity
        alpha = float("-inf")
        beta = float("inf")
        # Calculate the scores for moving left, staying still, and moving right
        scores = [self.calculate_score(move, alpha, beta) for move in [-1, 0, 1]]
        # Choose the move with the highest score
        return [-1, 0, 1][scores.index(max(scores))]

    def calculate_score(self, move, alpha, beta):
        # Apply the move to get the new paddle position
        new_paddle_x = self.paddle2_x + move * self.paddle_speed
        # Calculate the score based on how close the new paddle position is to the ball
        score = -abs(self.ball_x - new_paddle_x)
        # If the score is less than the current best score for the opponent (beta), we can stop evaluating this branch
        if score < beta:
            return score
        # If the score is greater than the current best score for us (alpha), update alpha
        if score > alpha:
            alpha = score
        return alpha

    def update_state(self, bx, bz, b_dx, b_dz, p1x, p2x):
        if time.time() - self.last_update > 0.2:
            self.ball_x = bx
            self.ball_z = bz
            self.ball_dx = b_dx
            self.ball_dz = b_dz
            self.paddle1_x = p1x
            self.paddle2_x = p2x
            self.last_update = time.time()


class GameEngine:
    def __init__(self, score1, score2):
        self.width = 6
        self.height = 12
        self.half_width = self.width / 2
        self.half_height = self.height / 2
        self.win_score = 2
        self.score = [score1, score2]
        self.ball = Ball()
        self.paddle1 = Paddle(0, 6)
        self.paddle2 = Paddle(0, -6)
        self.done = False
        self.state = "waiting"
        self.winner_id = None
        self.loser_id = None
        self.isAI = False
        self.ai = AI(
            self.ball.x,
            self.ball.z,
            self.ball.dx,
            self.ball.dz,
            self.paddle1.x,
            self.paddle2.x,
            self.width,
            self.height,
            self.paddle1.width,
            self.paddle1.speed,
            self.half_width,
        )
        self.mode = None

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
            self.winner_id = id1
            self.loser_id = id2
            self.state = "gameover"
            self.done = True

    # this function is to prevent paddles from going through the wall , it can be improved
    # maybe by adding a bounce effect or integrate this logic in the move function
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
        if id == 1:
            self.paddle1.move(direction)
        elif id == 2 and self.isAI == False:
            self.paddle2.move(direction)

    def start(self, mode):
        self.mode = mode
        if mode == "practice":
            self.isAI = True
            self.ai.update_state(
                self.ball.x,
                self.ball.z,
                self.ball.dx,
                self.ball.dz,
                self.paddle1.x,
                self.paddle2.x,
            )
        self.state = "playing"

    def update(self):
        self.paddles_wall_collision()
        self.ball.update()
        self.ball_wall_collision()
        self.ball_paddle_collision()
        self.check_score()
        if self.isAI:
            self.ai_move()

    def ai_move(self):
        self.ai.update_state(
            self.ball.x,
            self.ball.z,
            self.ball.dx,
            self.ball.dz,
            self.paddle1.x,
            self.paddle2.x,
        )
        self.paddle2.move(self.ai.calculate_ai_move())

    def get_state(self):
        return {
            "type": "game_state",
            "state": self.state,
            "mode": self.mode,
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
            "mode": self.mode,
            "state": "gameover",
            "winner": self.winner_id,
            "loser": self.loser_id,
            "score": {
                "player1": self.score[0],
                "player2": self.score[1],
            },
        }
