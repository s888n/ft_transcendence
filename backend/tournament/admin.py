from django.contrib import admin

# Register your models here.

from .models import TournamentMatch, Tourmanent

admin.site.register(TournamentMatch)
admin.site.register(Tourmanent)
