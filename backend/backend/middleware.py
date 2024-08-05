from django.contrib.auth.models import AnonymousUser
from rest_framework.authtoken.models import OutgoingToken as Token
from channels.db import database_sync_to_async
from channels.middleware import BaseMiddleware


@database_sync_to_async
def get_user(token_key):
    try:
        token = Token.objects.get(key=token_key)
        print("TOKEN USER", token.user)
        return token.user
    except Token.DoesNotExist:
        print("ANONYMOUS USER")
        return AnonymousUser()


class TokenAuthMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        query = dict((x.split("=") for x in scope["query_string"].decode().split("&")))
        token_key = query.get("token")
        print("TOKEN KEY", token_key)
        if token_key:
            scope["user"] = await get_user(token_key)
        return await super().__call__(scope, receive, send)
