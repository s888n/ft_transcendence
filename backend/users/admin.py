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
    list_display = ['user', 'get_friends_list']

    def get_friends_list(self, obj):
        return ", ".join([str(friend) for friend in obj.friends.all()])
    get_friends_list.short_description = 'Friends List'
    
@admin.register(FriendBlock)
class FriendBlockAdmin(admin.ModelAdmin):
    actions = ['block']

    def block_user(self, request, queryset):
        for request in queryset:
            request.block_user()
    

@admin.register(FriendRequest)
class FriendRequestAdmin(admin.ModelAdmin):
    list_display = ['sender', 'receiver', 'is_active']
    list_filter = ['is_active']
    actions = ['accept_selected', 'reject_selected', 'cancel_selected']

    def accept_selected(self, request, queryset):
        for request in queryset:
            request.accept()
    accept_selected.short_description = 'Accept selected friend requests'

    def reject_selected(self, request, queryset):
        queryset.update(is_active=False)
    reject_selected.short_description = 'Reject selected friend requests'

    def cancel_selected(self, request, queryset):
        queryset.update(is_active=False)
    cancel_selected.short_description = 'Cancel selected friend requests'
