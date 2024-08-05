from django.urls import path, re_path
from . import views


urlpatterns = [
    re_path("send_game_invite", views.send_game_invite),
    re_path("accept_game_invite", views.accept_game_invite),
]
