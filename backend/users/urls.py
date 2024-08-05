from django.urls import re_path, path

from . import views

urlpatterns = [
    re_path("api/signup", views.signup),
    re_path("api/login", views.login),
    re_path("api/test_token", views.test_token),
    re_path("api/profile", views.profile),
    re_path("api/get_user", views.get_user),
    re_path("api/users", views.users),
    # re_path('matchHistory', views.matchHistory),
    re_path("api/change_password", views.change_password),
    re_path("api/get_friends", views.get_friends),
    re_path("api/send_request", views.send_request),
    re_path("api/get_request", views.get_request),
    re_path("api/accept_request", views.accept_request),
    re_path("api/cancel_request", views.cancel_request),
    re_path("api/reject_request", views.reject_request),
    re_path("api/unfriend", views.unfriend),
    re_path("api/intra", views.intra),
    re_path("api/deblock_user", views.deblock_user),
    re_path("api/block", views.block),
    re_path("api/update_avatar", views.update_avatar),
    re_path("^api/search/(?P<value>.+)/$", views.SearchList.as_view()),
    path("api/images/<str:image_name>/", views.serve_image, name="serve_image"),
]
