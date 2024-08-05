import os

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
import notifications.routing as notifications_routing
import game.routing as game_routing
from tournament.routing import websocket_urlpatterns as tournament_websocket_urlpatterns
from channels.security.websocket import AllowedHostsOriginValidator
from chat.middlewares import WebSocketJWTAuthenticationMiddleware

# from .middleware import TokenAuthMiddleware

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")

asgi_application = get_asgi_application()


import chat.routing

application = ProtocolTypeRouter(
    {
        "http": asgi_application,
        "websocket": WebSocketJWTAuthenticationMiddleware(
            AllowedHostsOriginValidator(
                URLRouter(
                    chat.routing.chat_websocket_urlpatterns
                    + notifications_routing.websocket_urlpatterns
                    + game_routing.websocket_urlpatterns
                    + tournament_websocket_urlpatterns
                )
            )
        ),
    }
)
