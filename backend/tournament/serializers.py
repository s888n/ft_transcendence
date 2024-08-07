from .models import TournamentMatch, Tournament
from rest_framework import serializers


class TournamentMatchSerializer(serializers.ModelSerializer):

    class Meta:
        model = TournamentMatch
        fields = (
            "id",
            "player1",
            "player2",
            "score1",
            "score2",
            "winner",
            "round",
            "finished",
        )


class TournamentSerializer(serializers.ModelSerializer):
    matches = TournamentMatchSerializer(many=True, read_only=True, source="get_matches")

    class Meta:
        model = Tournament
        fields = (
            "id",
            "name",
            "creator",
            "created",
            "players",
            "winner",
            "matches",
            "rounds",
            "player_count",
            "current_round",
            "finished",
        )

    def validate_count(self, data):
        if data["player_count"] == "4" and len(data["players"]) != 4:
            raise serializers.ValidationError("4 players required")
        if data["player_count"] == "8" and len(data["players"]) != 8:
            raise serializers.ValidationError("8 players required")
        return data

    def validate_names(self, data):
        if len(data["players"]) != len(set(data["players"])):
            raise serializers.ValidationError("Player names must be unique")
        # check for empty strings or strings with only spaces
        for name in data["players"]:
            if not name.strip():
                raise serializers.ValidationError("Player names cannot be empty")
        return data
