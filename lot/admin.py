from django.contrib import admin
from .models import Settings,Clients,Topics
# Register your models here.
# 自定义管理站点的名称和URL标题



@admin.register(Settings)
class SettingsAdmin(admin.ModelAdmin):
    list_display = ('title','key','value','created_at','updated_at')
    list_per_page = 28

@admin.register(Clients)
class ClientsAdmin(admin.ModelAdmin):
    list_display = ('name','client_key','longitude','latitude','topic','description','created_at','updated_at')
    # 在查看修改时：制每页显示的对象数量，默认是100
    list_per_page = 28
    # 在查看修改时：给出一个筛选机制，一般按照时间比较好
    date_hierarchy = 'created_at'
    # 在查看修改时：激活过滤器
    # list_filter = ('created_at', 'name')


@admin.register(Topics)
class TopicsAdmin(admin.ModelAdmin):
    list_display = ('name','key','topic','description','r_client')
    list_per_page = 28
