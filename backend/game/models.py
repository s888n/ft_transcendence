from django.db import models
from users.models import User
from datetime import datetime

# import timezones
from django.utils import timezone


# Create your models here.
class Match(models.Model):
    player1 = models.ForeignKey(User, on_delete=models.CASCADE, related_name="player1")
    player2 = models.ForeignKey(User, on_delete=models.CASCADE, related_name="player2")
    player1_score = models.IntegerField(default=0)
    player2_score = models.IntegerField(default=0)
    player1_pauses = models.IntegerField(default=0)
    player2_pauses = models.IntegerField(default=0)
    create_at = models.DateTimeField(auto_now_add=True)
    mode = models.CharField(max_length=20, null=True)
    finished = models.BooleanField(default=False)
    winner = models.ForeignKey(
        User, on_delete=models.SET_NULL, blank=True, null=True, related_name="winner"
    )

class LocalMatch(models.Model):
    creator = models.ForeignKey(User, on_delete=models.CASCADE)
    create_at = models.DateTimeField(auto_now_add=True)
    player1 = models.CharField(max_length=20)
    player2 = models.CharField(max_length=20)
    player1_score = models.IntegerField(default=0)
    player2_score = models.IntegerField(default=0)
    mode = models.CharField(max_length=20, null=True)
    finished = models.BooleanField(default=False)
    winner = models.CharField(max_length=20, blank=True, null=True)