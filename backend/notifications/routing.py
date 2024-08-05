from django.urls import path, re_path

from .consumers import NotificationConsumer
from django.urls import path, re_path
from .consumers import NotificationConsumer
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from django.core.asgi import get_asgi_application


websocket_urlpatterns = [
    re_path(r"ws/notifications/$", NotificationConsumer.as_asgi()),
]
