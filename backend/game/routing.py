from django.urls import re_path
from .consumers import LocalGameConsumer, OnlineGameConsumer


websocket_urlpatterns = [
    re_path(r"ws/localgame/$", LocalGameConsumer.as_asgi()),
    re_path(r"ws/onlinegame/$", OnlineGameConsumer.as_asgi()),
]
