from rest_framework import serializers
from .models import Match, LocalMatch

class MatchSerializer(serializers.ModelSerializer):
    # instead of returning the id of the player, we will return the avatar , username and email
    player1 = serializers.SerializerMethodField()
    player2 = serializers.SerializerMethodField()
    winner = serializers.SerializerMethodField()
    class Meta:
        model = Match
        fields = "__all__"

    def get_player1(self, obj):
        return {
            "avatar": obj.player1.avatar,
            "username": obj.player1.username,
        }
    
    def get_player2(self, obj):
        return {
            "avatar": obj.player2.avatar,
            "username": obj.player2.username,
        }
    
    def get_winner(self, obj):
        if obj.winner:
            return {
                "avatar": obj.winner.avatar,
                "username": obj.winner.username,
            }
        return None

class LocalMatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = LocalMatch
        fields = "__all__"