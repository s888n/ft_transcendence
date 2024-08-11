from rest_framework.decorators import api_view
from rest_framework.response import Response
from .consumers import NotificationConsumer
from .serializers import NotificationSerializer
from asgiref.sync import async_to_sync, sync_to_async
from channels.layers import get_channel_layer
import logging
from game.models import Match
from users.models import User


@api_view(["POST"])
def send_game_invite(request):
    if not request.data.get("sender") or not request.data.get("receiver"):
        return Response({"message": "Invalid request"}, status=400)

    sender = request.data.get("sender")
    receiver = request.data.get("receiver")
    channel_layer = get_channel_layer()
    try:
        async_to_sync(channel_layer.group_send)(
            f"notifications_{receiver}",
            {
                "type": "send_invite",
                "sender": sender,
                "receiver": receiver,
            },
        )
    except Exception as e:
        logging.error(f"Error sending game invite: {e}")
        return Response({"message": "Error sending invite"}, status=500)

    return Response({"message": "Invite sent"})


@api_view(["POST"])
def accept_game_invite(request):
    if not request.data.get("sender") or not request.data.get("receiver"):
        return Response({"message": "Invalid request"}, status=400)
    sender = request.data.get("sender")
    receiver = request.data.get("receiver")
    channel_layer = get_channel_layer()

    # create a match
    match = Match.objects.create(
        player1=User.objects.get(username=sender),
        player2=User.objects.get(username=receiver),
    )

    async_to_sync(channel_layer.group_send)(
        f"notifications_{sender}",
        {
            "type": "accept_invite",
            "sender": sender,
            "receiver": receiver,
            "match_id": match.id,
        },
    )
    async_to_sync(channel_layer.group_send)(
        f"notifications_{receiver}",
        {
            "type": "accept_invite",
            "sender": sender,
            "receiver": receiver,
            "match_id": match.id,
        },
    )
    return Response({"message": "Invite accepted", "match_id": match.id})