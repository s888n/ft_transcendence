from django.contrib import admin

# Register your models here.

from .models import TournamentMatch, Tournament

admin.site.register(TournamentMatch)
admin.site.register(Tournament)
