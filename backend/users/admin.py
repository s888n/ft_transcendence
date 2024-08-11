from django.contrib import admin
from .models import FriendsList, FriendRequest, User, BlockedList, FriendBlock

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    pass

@admin.register(BlockedList)
class BlockedListAdmin(admin.ModelAdmin):
    pass

@admin.register(FriendsList)
class FriendsListAdmin(admin.ModelAdmin):
    pass
    
@admin.register(FriendBlock)
class FriendBlockAdmin(admin.ModelAdmin):
    pass
    

@admin.register(FriendRequest)
class FriendRequestAdmin(admin.ModelAdmin):
    pass
