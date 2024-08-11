from rest_framework import serializers
from .models import User, MatchHistory, Avatar, FriendsList, FriendRequest, FriendBlock
from django.contrib.auth.hashers import check_password
import django.contrib.auth.password_validation as validators
from django.core import exceptions


class UserGetterSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = User
        fields = ["username", "email", "nickname", "avatar" , "id" , "is_online"]
        
class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True)

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Incorrect current password")
        return value

    def validate_new_password(self, value):
        user = self.context['request'].user
        validators.validate_password(value, user=user)
        return value

    def save(self):
        user = self.context['request'].user
        new_password = self.validated_data['new_password']
        user.set_password(new_password)
        user.save()
        return user


class RegisterUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    
    class Meta(object):
        model = User
        fields = ["id", "username", "email", "password"]
    
    
class UserSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = User
        fields = ["username", "email", "nickname", "avatar" , "id" , "is_online"]

    def update(self, instance, validated_data):
        if "username" in validated_data:
            doesUsernameExist = (
                User.objects.filter(
                    username=validated_data.get("username", instance.username)
                )
                .exclude(id=instance.id)
                .first()
            )
            if doesUsernameExist:
                raise serializers.ValidationError(
                    {"username": "Username already exists."}
                )
            instance.username = validated_data.get("username", instance.username)
        if "email" in validated_data:
            doesEmailExist = (
                User.objects.filter(email=validated_data.get("email", instance.email))
                .exclude(id=instance.id)
                .first()
            )
            if doesEmailExist:
                raise serializers.ValidationError({"email": "Email already exists."})
            instance.email = validated_data.get("email", instance.email)
        if "nickname" in validated_data:
            doesNicknameExist = (
                User.objects.filter(
                    nickname=validated_data.get("nickname", instance.nickname)
                )
                .exclude(id=instance.id)
                .first()
            )
            if doesNicknameExist:
                raise serializers.ValidationError(
                    {"nickname": "Nickname already exists."}
                )
            instance.nickname = validated_data.get("nickname", instance.nickname)
        instance.save()
        return instance


class User42Serializer(serializers.ModelSerializer):
    class Meta(object):
        model = User
        fields = [
            "username",
            "email",
            "nickname",
            "avatar",
            "first_username",
            "first_email",
        ]

    def create(self, validated_data):
        return super().create(validated_data)


class FriendsListSerializer(serializers.ModelSerializer):
    friends = UserSerializer(many=True)

    class Meta:
        model = FriendsList
        fields = "__all__"


class FriendRequestSerializer(serializers.ModelSerializer):
    sender = UserSerializer()

    class Meta:
        model = FriendRequest
        fields = "__all__"

    def create(self, validated_data):
        return FriendRequest.objects.create(**validated_data)

    def accept(self, intance):
        intance.accept()

    def reject(self, intance):
        intance.reject()

    def cancel(self, intance):
        intance.cancel()


class FriendBlockSerializer(serializers.ModelSerializer):
    blocker = UserSerializer()
    blocked = UserSerializer()

    class Meta:
        model = FriendBlock
        fields = "__all__"

    def create(self, validated_data):
        return FriendBlock.objects.create(**validated_data)

    def block_user(self, intance):
        intance.block_user()

    def deblock_user(self, intance):
        intance.deblock_user()


class MatchHistorySerializer(serializers.ModelSerializer):
    class Meta(object):
        model = MatchHistory
        fields = ["user", "opponent", "date_played", "result", "details"]


class AvatarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Avatar
        fields = (
            "file",
            "uploaded_on",
        )
