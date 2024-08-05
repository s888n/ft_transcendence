
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import authenticate
from rest_framework import serializers


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        print("URURURURURURU")
        response = super().get_token(user)

        # Add custom claims
        response['user'] = {
            "username": user.username,
            "nickname": user.nickname,
            "email": user.email,
            "avatar": "avavavav"
        }
        # ...

        return response
    
class MyTokenObtainPairView(TokenObtainPairView):
    print("ccc here")
    serializer_class = MyTokenObtainPairSerializer
    
    def post(self, request, *args, **kwargs):
        print("reqqqq", request.data, request.COOKIES)
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            access_token = response.data['access']
            refresh_token = response.data['refresh']
            
            # Remove tokens from response data
            # del response.data['access']
            # del response.data['refresh']
        return response