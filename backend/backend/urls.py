from django.urls import include, path
from rest_framework import routers
from users import urls as users_urls
from notifications import urls as notifications_urls
from game import urls as game_urls
from tournament import urls as tournament_urls
from .views import MyTokenObtainPairView
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)
from chat import urls as chat_urls
from django.conf.urls.static import static
from django.conf import settings
from django.contrib import admin


# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = (
    [
        path("admin/", admin.site.urls),
        path("api/token", MyTokenObtainPairView.as_view(), name="token_obtain_pair"),
        # path("api/token/refresh", TokenRefreshView.as_view(), name="token_refresh"),
        path("api/chat/", include(chat_urls)),
        path("api/game/", include(game_urls)),
        path("api/tournament/", include(tournament_urls)),
        path("api/notifications/", include(notifications_urls)),
    ]
    + users_urls.urlpatterns
)

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
