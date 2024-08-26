from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes,
)
from notifications.consumers import NotificationConsumer
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.http import HttpResponse
from rest_framework import status
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.auth.hashers import make_password
from django.contrib.auth.hashers import check_password
from rest_framework.parsers import JSONParser, MultiPartParser
from rest_framework.decorators import parser_classes
import os
from django.conf import settings
from rest_framework import filters
from rest_framework import generics
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.views import APIView
from django.contrib.auth.base_user import BaseUserManager
from rest_framework.utils import json
import requests
from django.http import HttpResponseRedirect
from django.urls import reverse
from .helpers import (
    generate_random_email,
    generate_random_username,
    generate_random_avatar_name,
)
from django.db.models import Q
from chat.models import ChatRoom
from django.utils import timezone


from django.shortcuts import get_object_or_404
from .models import (
    User,
    MatchHistory,
    FriendsList,
    FriendRequest,
    BlockedList,
    FriendBlock,
)
from rest_framework.authtoken.models import Token

from .serializers import (
    UserSerializer,
    MatchHistorySerializer,
    AvatarSerializer,
    UserGetterSerializer,
    FriendsListSerializer,
    FriendRequestSerializer,
    User42Serializer,
    FriendBlockSerializer,
    RegisterUserSerializer,
    ChangePasswordSerializer
)
from rest_framework_simplejwt.tokens import RefreshToken



@api_view(["POST"])
@parser_classes([JSONParser])
def signup(request):
    serializer = RegisterUserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        user.set_password(request.data["password"])
        user.save()

        token_payload = {
            "user": {
                "username": user.username,
                "nickname": user.nickname,
                "email": user.email,
                "avatar": user.avatar or "dafault.png",
                "id": user.id
            }
        }

        refresh = RefreshToken.for_user(user)
        refresh.payload.update(token_payload)
        access_token = str(refresh.access_token)

        return Response(
            {
                "message": "User registered successfully",
                "access": access_token,
                "refresh": str(refresh),
            },
            status=status.HTTP_201_CREATED,
        )

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
@parser_classes([JSONParser])
def login(request):
    if "email" not in request.data or "password" not in request.data:
        return Response(
            {"error": "Email and password are required"},
            status=status.HTTP_400_BAD_REQUEST,
        )
    emailOwner = get_object_or_404(User, email=request.data["email"])
    if emailOwner.is_from_42:
        return Response(
            {"User with your username or email already exist!"},
            status=status.HTTP_409_CONFLICT,
        )
    if not emailOwner.check_password(request.data["password"]):
        return Response("missing email", status=status.HTTP_404_NOT_FOUND)
    token, created = Token.objects.get_or_create(user=emailOwner)
    serializer = UserSerializer(emailOwner)
    return Response({"token": token.key, "user": serializer.data})


@api_view(["GET", "PUT"])  # Use PUT method for updating the user profile
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])  # Require authentication to access this endpoint
@parser_classes([JSONParser])
def profile(request):
    if request.method == "PUT":
        user = request.user  # Get the authenticated user
        serializer = UserSerializer(
            user, data=request.data, partial=True
        )  # Use partial=True to allow partial updates
        if serializer.is_valid():
            serializer.save()  # Save the updated data
            return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == "GET":
        user = request.user
        data = {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "nickname": user.nickname,
            "avatar": user.avatar,
        }
        if not data["avatar"]:
            data["avatar"] = "defaullt.png"
        return Response(data, status=status.HTTP_200_OK)


@api_view(["PUT"])  # Use PUT method for updating the user profile
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
@parser_classes([JSONParser])
def change_password(request):
    serializer = ChangePasswordSerializer(data=request.data, context={'request': request})
    
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Password updated successfully"}, status=202)
    
    return Response(serializer.errors, status=400)



@api_view(["GET"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
@parser_classes([JSONParser])
def users(request):
    users = User.objects.all()
    serializer = UserGetterSerializer(users, many=True)
    return Response(serializer.data)


@api_view(["PUT"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser])
def update_avatar(request):
    if "file" in request.data:
        file_obj = request.data["file"]
        serializer = AvatarSerializer(data={"file": file_obj})
        if serializer.is_valid():
            upload_dir = os.path.join(settings.MEDIA_ROOT, "avatars")
            os.makedirs(upload_dir, exist_ok=True)
            user = request.user
            if user.avatar != "" and user.avatar != "default.png":
                old_avatar = os.path.join(upload_dir, user.avatar)
                if os.path.exists(old_avatar):
                    os.remove(old_avatar)
            file_name = file_obj.name
            file_extension = os.path.splitext(file_name)[1]
            file_name = (
                generate_random_avatar_name(10, file_extension) + file_extension
             )
            filename = os.path.join(upload_dir, file_name)

            with open(filename, "wb") as destination:
                for chunk in file_obj.chunks():
                    destination.write(chunk)

            user.avatar = file_name
            user.save()
            return Response(
            {"avatar_updated": True, "file_path": file_name},
            status=status.HTTP_202_ACCEPTED,
        )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({"error": "No file provided"}, status=400)


def serve_image(request, image_name):
    image_path = os.path.join(settings.MEDIA_ROOT, "avatars/", image_name)
    if os.path.exists(image_path):
        with open(image_path, "rb") as image_file:
            return HttpResponse(
                image_file.read(), content_type="image/jpeg"
            )  # Adjust content_type based on your image type
    default_path = os.path.join(settings.MEDIA_ROOT, "avatars/", "default.png")
    with open(default_path, "rb") as image_file:
        return HttpResponse(
            image_file.read(), content_type="image/jpeg"
        )  # Adjust content_type based on your image type


@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
class SearchList(generics.ListAPIView):
    serializer_class = UserGetterSerializer

    def get_queryset(self):
        value = self.kwargs["value"]
        user = self.request.user

        blocked_by = FriendBlock.objects.filter(blocked=user).values_list(
            "blocker", flat=True
        )
        search_result = User.objects.filter(Q(username__istartswith=value)).exclude(
            id__in=blocked_by
        )
        return search_result


@api_view(["POST"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def block(request):
    if "username" not in request.data:
        return Response(
            {"error": "username is requerid!"}, status=status.HTTP_400_BAD_REQUEST
        )
    blocker = request.user
    # to_be_blocked = get_object_or_404(User, username=request.data['username'])
    to_be_blocked = get_object_or_404(User, username=request.data["username"])
    if blocker == to_be_blocked:
        return Response(
            {"error": "Can't send block yourself hhh!"},
            status=status.HTTP_403_FORBIDDEN,
        )
    try:
        FriendBlock.objects.get(blocker=blocker, blocked=to_be_blocked)
        return Response(
            {"error": "already blocked"}, status=status.HTTP_400_BAD_REQUEST
        )

    except ObjectDoesNotExist:
        new_friend_block = FriendBlock.objects.create(
            blocker=blocker, blocked=to_be_blocked
        )
        serializer = FriendBlockSerializer(new_friend_block)
        blocked_list, _ = BlockedList.objects.get_or_create(user=blocker)
        blocked_list.block_user(to_be_blocked)
        sorted_ids = sorted([blocker.id, to_be_blocked.id])
        ChatRoom.objects.filter(user1=sorted_ids[0], user2=sorted_ids[1]).delete()
        channel_layer = get_channel_layer()
        try:
            async_to_sync(channel_layer.group_send)(
                f"notifications_{to_be_blocked.username}",
                {
                    "type": "block",
                    "sender": blocker.username,
                    "receiver": to_be_blocked.username,
                    "message": "You have been blocked by " + blocker.username,
                },
            )
        except Exception as e:
            print("faliure", e)
            pass

        return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(["POST"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def deblock_user(request):
    if "username" not in request.data:
        return Response(
            {"error": "username is requerid!"}, status=status.HTTP_400_BAD_REQUEST
        )
    blocker = request.user
    to_be_blocked = get_object_or_404(User, username=request.data["username"])
    if blocker == to_be_blocked:
        return Response(
            {"error": "Can't send block yourself hhh!"},
            status=status.HTTP_403_FORBIDDEN,
        )
    try:
        block = FriendBlock.objects.get(blocker=blocker, blocked=to_be_blocked)
    except ObjectDoesNotExist:
        return Response({"error": "not blocked"}, status=status.HTTP_403_FORBIDDEN)
    block.delete()
    blocked_list, _ = BlockedList.objects.get_or_create(user=blocker)
    blocked_list.deblock_user(to_be_blocked)

    return Response({"deblocked successfully"}, status=status.HTTP_201_CREATED)


@api_view(["GET"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def get_friends(request):
    user = request.user
    friends, _ = FriendsList.objects.get_or_create(user=user)
    serializer = FriendsListSerializer(friends)
    return Response(serializer.data)


@api_view(["POST"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def send_request(request):
    if "username" not in request.data:
        return Response(
            {"error": "username is requerid!"}, status=status.HTTP_400_BAD_REQUEST
        )
    sender = request.user
    receiver = get_object_or_404(User, username=request.data["username"])
    if BlockedList.objects.filter(user=sender, blocked_list=receiver).exists():
        return Response(
            {"error": "You have blocked the receiver"}, status=status.HTTP_403_FORBIDDEN
        )
    if BlockedList.objects.filter(user=receiver, blocked_list=sender).exists():
        return Response(
            {"error": "You have been blocked by the receiver"},
            status=status.HTTP_403_FORBIDDEN,
        )

    if sender == receiver:
        return Response(
            {"error": "Can't send request to yourself hhh!"},
            status=status.HTTP_403_FORBIDDEN,
        )
    try:
        request = FriendRequest.objects.get(sender=receiver, receiver=sender)
        if request and request.is_active:
            return Response(
                {"error": "Can't send request if they already sent you request!"},
                status=status.HTTP_403_FORBIDDEN,
            )
    except ObjectDoesNotExist:
        pass
    try:
        request = FriendRequest.objects.get(sender=sender, receiver=receiver)
    except ObjectDoesNotExist:
        new_friend_request = FriendRequest.objects.create(
            sender=sender, receiver=receiver
        )
        serializer = FriendRequestSerializer(new_friend_request)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    friends_list, _ = FriendsList.objects.get_or_create(user=sender)
    if friends_list.are_friends(receiver):
        return Response(
            {"error": "Already friends"}, status=status.HTTP_400_BAD_REQUEST
        )
    if request and request.is_active:
        return Response(
            {"error": "request already active"}, status=status.HTTP_400_BAD_REQUEST
        )
    new_friend_request, _ = FriendRequest.objects.get_or_create(
        sender=sender, receiver=receiver
    )
    channel_layer = get_channel_layer()
    new_friend_request.is_active = True
    new_friend_request.save()

    serializer = FriendRequestSerializer(new_friend_request)
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(["POST"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def cancel_request(request):
    if "username" not in request.data:
        return Response(
            {"error": "username is requerid!"}, status=status.HTTP_400_BAD_REQUEST
        )
    sender = request.user
    receiver = get_object_or_404(User, username=request.data["username"])
    # receiver = get_object_or_404(User, username=request.data['username'])
    if BlockedList.objects.filter(user=sender, blocked_list=receiver).exists():
        return Response(
            {"error": "You have blocked the receiver"}, status=status.HTTP_403_FORBIDDEN
        )
    if BlockedList.objects.filter(user=receiver, blocked_list=sender).exists():
        return Response(
            {"error": "You have been blocked by the receiver"},
            status=status.HTTP_403_FORBIDDEN,
        )
    request = get_object_or_404(FriendRequest, receiver=receiver, sender=sender)
    if request and request.is_active == True:
        request.cancel()
        return Response("Request canceled", status=status.HTTP_201_CREATED)
    return Response("Request denied", status=status.HTTP_403_FORBIDDEN)


@api_view(["POST"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def reject_request(request):
    if "username" not in request.data:
        return Response(
            {"error": "username is requerid!"}, status=status.HTTP_400_BAD_REQUEST
        )
    rejecter = request.user
    sender = get_object_or_404(User, username=request.data["username"])
    # sender = get_object_or_404(User, username=request.data['username'])
    if BlockedList.objects.filter(user=rejecter, blocked_list=sender).exists():
        return Response(
            {"error": "You have blocked the sender"}, status=status.HTTP_403_FORBIDDEN
        )
    if BlockedList.objects.filter(user=sender, blocked_list=rejecter).exists():
        return Response(
            {"error": "You have been blocked by the sender"},
            status=status.HTTP_403_FORBIDDEN,
        )
    request = get_object_or_404(FriendRequest, receiver=rejecter, sender=sender)
    if request and request.is_active == True:
        request.reject()
        return Response("Request canceled", status=status.HTTP_201_CREATED)
    return Response("Request denied", status=status.HTTP_403_FORBIDDEN)


@api_view(["POST"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def accept_request(request):
    if "username" not in request.data:
        return Response(
            {"error": "username is requerid!"}, status=status.HTTP_400_BAD_REQUEST
        )
    accepter = request.user
    sender = get_object_or_404(User, username=request.data["username"])
    # sender = get_object_or_404(User, username=request.data['username'])
    if BlockedList.objects.filter(user=accepter, blocked_list=sender).exists():
        return Response(
            {"error": "You have blocked the sender"}, status=status.HTTP_403_FORBIDDEN
        )
    if BlockedList.objects.filter(user=sender, blocked_list=accepter).exists():
        return Response(
            {"error": "You have been blocked by the sender"},
            status=status.HTTP_403_FORBIDDEN,
        )
    request = get_object_or_404(FriendRequest, receiver=accepter, sender=sender)
    if request and request.is_active:
        request.accept()
        try:
            sorted_ids = sorted([sender.id, accepter.id])
            user1 = User.objects.get(id=sorted_ids[0])
            user2 = User.objects.get(id=sorted_ids[1])
            ChatRoom.objects.create(
                user1=user1,
                user2=user2,
                last_sender=sender,
                unread_count=0,
                last_send_time=timezone.now(),
                last_message="",
            )
        except ObjectDoesNotExist:
            pass
        return Response("Request accepted", status=status.HTTP_201_CREATED)
    return Response({"error": "request denied"}, status=status.HTTP_403_FORBIDDEN)


@api_view(["POST"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def unfriend(request):
    if "username" not in request.data:
        return Response(
            {"error": "username is requerid!"}, status=status.HTTP_400_BAD_REQUEST
        )
    unfriender = request.user
    te_be_unfriended = get_object_or_404(User, username=request.data["username"])
    # te_be_unfriended = get_object_or_404(User, username=request.data['username'])
    unfriender_friends, _ = FriendsList.objects.get_or_create(user=unfriender)
    te_be_unfriended_friends, _ = FriendsList.objects.get_or_create(
        user=te_be_unfriended
    )
    unfriender_friends.unfriend(te_be_unfriended_friends)
    te_be_unfriended_friends.unfriend(unfriender_friends)
    sorted_ids = sorted([unfriender.id, te_be_unfriended.id])
    ChatRoom.objects.filter(user1=sorted_ids[0], user2=sorted_ids[1]).delete()
    return Response("Unfriended successfully", status=status.HTTP_201_CREATED)


@api_view(["GET"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def get_request(request):
    user = request.user
    requests = FriendRequest.objects.filter(receiver=user)
    serializer = FriendRequestSerializer(requests, many=True)
    return Response(serializer.data)


@api_view(["GET"])  # Use PUT method for updating the user profile
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])  # Require authentication to access this endpoint
@parser_classes([JSONParser])
def get_user(request):
    username = request.GET.get("username")
    if username is None:
        return Response(
            {"error": "username required"}, status=status.HTTP_400_BAD_REQUEST
        )

    user = get_object_or_404(User, username=username)
    if BlockedList.objects.filter(user=user, blocked_list=request.user).exists():
        return Response({"error": "User not found!"}, status=status.HTTP_404_NOT_FOUND)

    friendsList, _ = FriendsList.objects.get_or_create(user=request.user)
    are_friends = False
    if friendsList.are_friends(user):
        are_friends = True
    request_sent = False
    try:
        friend_request = FriendRequest.objects.get(sender=request.user, receiver=user)
        if friend_request.is_active:
            request_sent = True
    except ObjectDoesNotExist:
        request_sent = False
    request_received = False
    try:
        friend_request = FriendRequest.objects.get(sender=user, receiver=request.user)
        if friend_request.is_active:
            request_received = True
    except ObjectDoesNotExist:
        request_received = False
    blocked_by_you = False
    if BlockedList.objects.filter(user=request.user, blocked_list=user).exists():
        blocked_by_you = True

    data = {
        "username": user.username,
        "email": user.email,
        "nickname": user.nickname,
        "avatar": user.avatar,
        "is_friend": are_friends,
        "request_sent": request_sent,
        "request_received": request_received,
        "is_online": user.is_online,
        "blocked_by_you": blocked_by_you,
    }
    return Response(data, status=status.HTTP_200_OK)


@api_view(["GET", "POST"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
@parser_classes([JSONParser])
def matchHistory(request):
    if request.method == "GET":
        username = request.query_params.get("username")
        if not username:
            return Response(
                {"error": "Username parameter is missing"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = get_object_or_404(User, username=username)
        match_history = MatchHistory.objects.filter(user=user)
        serializer = MatchHistorySerializer(match_history, many=True)
        return Response(serializer.data)

    elif request.method == "GET":
        userMakingPost = request.user
        username = request.query_params.get("username")
        if not username:
            return Response(
                {"error": "Username parameter is missing"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        userGettingPost = get_object_or_404(User, username=username)
        if not userGettingPost:
            return Response(
                {"error": "User dow=es not exist"}, status=status.HTTP_400_BAD_REQUEST
            )

        serializer = MatchHistorySerializer(data=request.data)
        if serializer.is_valid():
            if userMakingPost != userGettingPost:
                return Response(
                    {"error": "Forbidden"}, status=status.HTTP_403_FORBIDDEN
                )
            serializer.save()
            match_history = MatchHistory.objects.filter(user=userMakingPost)
            serializer = MatchHistorySerializer(match_history, many=True)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_200_OK)


@api_view(["POST"])
def intra(request):
    if "access_token" not in request.data:
        return Response(
            {"error": "access_token required"}, status=status.HTTP_400_BAD_REQUEST
        )
    access_token = request.data["access_token"]
    payload = {"access_token": access_token}
    r = requests.get("https://api.intra.42.fr/v2/me", params=payload)
    if r.status_code != 200:
        return Response(json.loads(r.text))
    data2 = json.loads(r.text)
    username = data2["login"]
    email = data2["email"]
    nickname = ""
    avatar = "default.jpeg"
    serializer_data = {
        "username": username,
        "email": email,
        "avatar": avatar,
        "nickname": nickname,
    }
    try:
        user = User.objects.get(first_username=username)
        if not user.is_from_42:
            return Response(
                {"User with your username or email already exist!"},
                status=status.HTTP_409_CONFLICT,
            )
        refresh = RefreshToken.for_user(user)
        token_payload = {
            "user": {
                "username": user.username,
                "nickname": user.nickname,
                "email": user.email,
                "id": user.id,
                "avatar": user.avatar,
            }
        }
        refresh.payload.update(token_payload)
        access_token = str(refresh.access_token)
        return Response(
            {
                "message": "Loged in successfully",
                "access": access_token,
                "refresh": str(refresh),
            },
            status=status.HTTP_201_CREATED,
        )
    except ObjectDoesNotExist:
        pass
    serializer_data = {
        "username": generate_random_username(10, username),
        "email": generate_random_email("randomemail.com", email),
        "avatar": avatar,
        "nickname": nickname,
        "first_email": email,
        "first_username": username,
    }
    serializer = User42Serializer(data=serializer_data)
    if serializer.is_valid():
        user = serializer.save()
        # user = User.objects.get(username=username)
        password = User.objects.make_random_password()
        user.set_password(password)
        user.is_from_42 = True
        user.save()

        token_payload = {
            "user": {
                "username": user.username,
                "nickname": user.nickname,
                "email": user.email,
                "id": user.id,
                "avatar": user.avatar,
            }
        }

        refresh = RefreshToken.for_user(user)
        refresh.payload.update(token_payload)
        access_token = str(refresh.access_token)
        return Response(
            {
                "message": "User registered successfully",
                "access": access_token,
                "refresh": str(refresh),
            },
            status=status.HTTP_201_CREATED,
        )
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def test_token(request):
    return Response("passed!")


@api_view(["GET"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def is_online(request):
    user_id = request.id
    user = User.objects.get(id=user_id)
    return Response(user.is_online)



@api_view(["GET"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def get_friend_requests(request):
    user = request.user
    requests = FriendRequest.objects.filter(receiver=user, is_active=True)
    serializer = FriendRequestSerializer(requests, many=True)
    return Response(serializer.data)