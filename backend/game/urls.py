from django.urls import path, re_path
from .views import match_details, get_matches,get_all_matches

urlpatterns = [
    re_path(r"^match/(?P<pk>\d+)/$", match_details),
    re_path(r"^matches/(?P<username>\w+)/$", get_matches),
    re_path(r"^all_matches/$", get_all_matches),
]
