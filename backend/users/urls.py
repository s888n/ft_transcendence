from django.urls import re_path, path

from . import views

urlpatterns = [
    re_path("apiback/signup", views.signup),
    re_path("apiback/login", views.login),
    re_path("apiback/test_token", views.test_token),
    re_path("apiback/profile", views.profile),
    re_path("apiback/get_user", views.get_user),
    re_path("apiback/users", views.users),
    # re_path('matchHistory', views.matchHistory),
    re_path("apiback/change_password", views.change_password),
    re_path("apiback/get_friends", views.get_friends),
    re_path("apiback/send_request", views.send_request),
    re_path("apiback/get_request", views.get_request),
    re_path("apiback/accept_request", views.accept_request),
    re_path("apiback/cancel_request", views.cancel_request),
    re_path("apiback/reject_request", views.reject_request),
    re_path("apiback/get_friend_requests", views.get_friend_requests),
    re_path("apiback/unfriend", views.unfriend),
    re_path("apiback/intra", views.intra),
    re_path("apiback/deblock_user", views.deblock_user),
    re_path("apiback/block", views.block),
    re_path("apiback/update_avatar", views.update_avatar),
    re_path("^apiback/search/(?P<value>.+)/$", views.SearchList.as_view()),
    path("apiback/images/<str:image_name>/", views.serve_image, name="serve_image"),
]
