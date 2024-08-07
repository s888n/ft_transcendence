from django.shortcuts import render
from rest_framework.decorators import (
    api_view,
    permission_classes,
    authentication_classes,
)
from django.db.models import Q
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Match , LocalMatch
from .serializers import MatchSerializer , LocalMatchSerializer
from tournament.models import Tournament
from tournament.serializers import TournamentSerializer

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def match_details(request, pk):
    try:
        match = Match.objects.get(id=pk)
        user = request.user
        if user != match.player1 and user != match.player2:
            return Response(
                {"error": "You are not allowed to see this match"}, status=403
            )
        serializer_data = MatchSerializer(match).data
        return Response(serializer_data)
    except Match.DoesNotExist:
        return Response({"error": "Match not found"}, status=404)



@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_matches(request, username):
    matches = Match.objects.filter(player1__username=username
    ) | Match.objects.filter(
        player2__username=username
    )   
    # if not matches:
    #     return Response({"message": "No matches found"})
    serializer = MatchSerializer(matches, many=True)
    return Response(serializer.data)


# return all finished matches (local and online,tournament matches) sorted by date
# return player1 , player2 , winner , mode , created_at
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_all_matches(request):
    user = request.user
    if not user or not user.is_authenticated:
        return Response(
            {"error ": "You are not allowed to see this match"},
            status=status.HTTP_401_UNAUTHORIZED,
        )
    online_matches = Match.objects.filter(Q(player1=user) | Q(player2=user))
    online_matches_data = MatchSerializer(online_matches, many=True).data
    local_matches = LocalMatch.objects.filter(creator=user, finished=True)
    local_matches_data = LocalMatchSerializer(local_matches, many=True).data
    tournaments = Tournament.objects.filter(creator=user)
    tournaments_data= TournamentSerializer(tournaments, many=True).data
    all_matches = []
    for tournament in tournaments_data:
        for match in tournament["matches"]:
            if match["finished"]:
                all_matches.append(
                {
                    "player1": match["player1"],
                    "player2": match["player2"],
                    "winner": match["winner"],
                    "mode": "tournament",
                    "created_at": tournament["created"],
                    "finished": match["finished"],
                }
            )
    for match in local_matches_data:
        all_matches.append(
            {
                "player1": match["player1"],
                "player2": match["player2"],
                "winner": match["winner"],
                "mode": "local",
                "created_at": match["created_at"],
                "finished": match["finished"],
            }
        )
    for match in online_matches_data:
        all_matches.append(
            {
                "player1": match["player1"],
                "player2": match["player2"],
                "winner": match["winner"],
                "mode": "online",
                "created_at": match["created_at"],
                "finished": match["finished"],
            }
        )
    print(all_matches)
    return Response(all_matches)

