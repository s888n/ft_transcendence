from django.urls import path
from . import views

urlpatterns = [
    path('rooms/', views.chat_room_list),
    path('<int:chatroom_id>/messages/', views.message_list),
]