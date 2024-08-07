from django.db import models
from users.models import User


class TournamentMatch(models.Model):
    player1 = models.CharField(max_length=20, blank=True, null=True)
    player2 = models.CharField(max_length=20, blank=True, null=True)
    score1 = models.IntegerField(default=0)
    score2 = models.IntegerField(default=0)
    winner = models.CharField(max_length=20, blank=True, null=True)
    round = models.IntegerField(default=1)
    finished = models.BooleanField(default=False)
    tournament = models.ForeignKey(
        "Tournament", on_delete=models.CASCADE, related_name="matches"
    )


class Tournament(models.Model):

    class PlayerCount(models.TextChoices):
        FOUR = "4"
        EIGHT = "8"

    name = models.CharField(max_length=20)
    creator = models.ForeignKey(User, on_delete=models.CASCADE)
    created = models.DateTimeField(auto_now_add=True)
    players = models.JSONField(default=list)
    rounds = models.IntegerField(default=1)
    player_count = models.CharField(
        max_length=1, choices=PlayerCount.choices, default=PlayerCount.FOUR
    )
    current_round = models.IntegerField(default=1)
    finished = models.BooleanField(default=False)
    winner = models.CharField(max_length=20, blank=True, null=True)

    def __str__(self):
        return f"{self.name} - {self.creator}"

    def get_matches(self):
        return TournamentMatch.objects.filter(tournament=self)
