from .views import get_tournaments, create_tournament, get_tournament, next_match
from django.urls import path, re_path

urlpatterns = [
    re_path("get_tournaments", get_tournaments),
    re_path("create_tournament", create_tournament),
    re_path(r"next_match/(?P<pk>\d+)/", next_match),
    re_path(r"tournament/(?P<pk>\d+)/", get_tournament),
]
