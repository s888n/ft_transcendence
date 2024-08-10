from django.shortcuts import get_object_or_404
from .models import TournamentMatch, Tournament
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import (
    api_view,
    permission_classes,
    authentication_classes,
)
from .serializers import TournamentMatchSerializer, TournamentSerializer
from rest_framework.permissions import IsAuthenticated
import math
from random import shuffle
from django.db.models import Q


def get_next_match(tournament):
    try:
        match = (
            TournamentMatch.objects.filter(tournament=tournament, winner__isnull=True)
            .filter(Q(player1__isnull=True) | Q(player2__isnull=True))
            .first()
        )
        return match
    except TournamentMatch.DoesNotExist:
        return None


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_tournaments(request):
    user = request.user
    if not user or not user.is_authenticated:
        return Response(
            {"error": "who the fuck are you?"}, status=status.HTTP_401_UNAUTHORIZED
        )
    tournaments = Tournament.objects.filter(creator=user)
    serializer = TournamentSerializer(tournaments, many=True)
    return Response(serializer.data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_tournament(request):
    user = request.user
    tournament_name = request.data.get("name")
    number_of_players = request.data.get("numberOfPlayers")
    players_names = request.data.get("playersNames")
    rounds_count = math.ceil(math.log2(number_of_players))
    if not tournament_name or not players_names or not number_of_players:
        return Response({"error": "Bruh WTF?"}, status=status.HTTP_400_BAD_REQUEST)
    # make sure the players names are unique and without spaces
    # Make sure the players names are unique and without spaces
    unique_players_names = set(players_names)
    if len(unique_players_names) != len(players_names):
        return Response(
            {"error": "Player names must be unique"}, status=status.HTTP_400_BAD_REQUEST
        )
    for name in unique_players_names:
        if " " in name:
            return Response(
                {"error": "Player names cannot contain spaces"},
                status=status.HTTP_400_BAD_REQUEST,
            )

    # Shuffle the players names
    tournament = Tournament.objects.create(
        name=tournament_name,
        creator=user,
        rounds=rounds_count,
        player_count=number_of_players,
        players=players_names,
    )
    players_names = list(unique_players_names)
    shuffle(players_names)

    for i in range(0, number_of_players - 1, 2):
        match = TournamentMatch.objects.create(
            player1=players_names[i],
            player2=players_names[i + 1],
            tournament=tournament,
        )
    if number_of_players % 2 != 0:
        match = TournamentMatch.objects.create(
            player1=players_names[-1], tournament=tournament
        )

    for i in range(2, rounds_count + 1):
        turn = 2 ** (i - 1)
        for j in range(0, math.ceil(number_of_players / turn), 2):
            match = TournamentMatch.objects.create(round=i, tournament=tournament)

    return Response({"id": tournament.id}, status=status.HTTP_201_CREATED)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_tournament(request, pk):
    user = request.user
    tournament = Tournament.objects.filter(creator=user, id=pk).first()
    if not tournament:
        return Response(
            {"error": "Tournament not found"}, status=status.HTTP_404_NOT_FOUND
        )
    serializer = TournamentSerializer(tournament)
    return Response(serializer.data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def next_match(request, pk):
    tournament = get_object_or_404(Tournament, id=pk)
    user = request.user
    if tournament.creator != user:
        return Response(
            {"error": "You are not the creator of this tournament"},
            status=status.HTTP_401_UNAUTHORIZED,
        )
    match_id = request.data.get("matchId")
    winner = request.data.get("winner")
    if match_id is None or winner is None:
        return Response(
            {
                "error": "Invalid request",
                "matchId": match_id,
                "winner": winner,
            }, status=status.HTTP_400_BAD_REQUEST
        )
    try:
        match = TournamentMatch.objects.get(id=match_id)
        if match.winner:
            return
        match.winner = match.player1 if winner == 1 else match.player2
        match.save()
        next_match = get_next_match(tournament)
        if next_match is None:
            tournament.finished = True
            tournament.save()
            return Response({"message": "Tournament finished"}, status=status.HTTP_200_OK)
        elif next_match.player1 is None:
            next_match.player1 = match.winner
        elif next_match.player2 is None:
            next_match.player2 = match.winner
        next_match.save()
        return Response({"message": "Match updated"}, status=status.HTTP_200_OK)
    except TournamentMatch.DoesNotExist:
        return Response({"error": "Match not found"}, status=status.HTTP_404_NOT_FOUND)
