from django.shortcuts import render
from rest_framework.decorators import (
    api_view,
    permission_classes,
    authentication_classes,
)
from rest_framework.response import Response
from .models import Match
from rest_framework.permissions import IsAuthenticated

# Create your views here.
from rest_framework.permissions import IsAuthenticated
from .serializers import MatchSerializer


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


# @api_view(["GET"])
# @permission_classes([IsAuthenticated])
# def get_matches(request):
#     user = request.user
#     if not user or not user.is_authenticated:
#         return Response(
#             {"error ": "You are not allowed to see this match"},
#             status=status.HTTP_401_UNAUTHORIZED,
#         )
#     matches = Match.objects.filter(player1=user) | Match.objects.filter(player2=user)
#     # if not matches:
#     #     return Response({"error": "No matches found"}, status=404)
#     serializer = MatchSerializer(matches, many=True)
#     return Response(serializer.data)


@api_view(["GET"])
# @permission_classes([IsAuthenticated])
def get_matches(request, username):
    matches = Match.objects.filter(player1__username=username
    ) | Match.objects.filter(
        player2__username=username
    )   
    # if not matches:
    #     return Response({"message": "No matches found"})
    serializer = MatchSerializer(matches, many=True)
    return Response(serializer.data)
