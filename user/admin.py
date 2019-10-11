from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User
from .models import Profile, OAuthRelationship


@admin.register(OAuthRelationship)
class OAuthRelationshipAdmin(admin.ModelAdmin):
    list_display = ('user', 'oauth_type', 'openid')
    list_per_page = 28

class ProfileInline(admin.StackedInline):
    model = Profile
    can_delete = False
    list_per_page = 28

class UserAdmin(BaseUserAdmin):
    inlines = (ProfileInline, )
    list_display = ('username', 'nickname','email', 'is_staff', 'is_active', 'is_superuser')
    list_per_page = 28

    def nickname(self, obj):
        return obj.profile.nickname
    nickname.short_description = '昵称'

# Re-register UserAdmin
admin.site.unregister(User)
admin.site.register(User, UserAdmin)

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'nickname','avatar')
    list_per_page = 28
