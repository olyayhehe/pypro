#!/usr/bin/env python
# -*- coding:utf-8 -*-
# Author:He

from django.conf.urls import url
from django.conf.urls import include
from . import views
from django.views.static import serve
from  django.conf import  settings
urlpatterns = [
    url(r'^orm.html$', views.orm), #写入初始数据
    url(r'^logout.html$', views.logout),
    url(r'^realmap.html$', views.realmap),
    url(r'^mqcontrol.html$', views.mqcontrol),  # mqtt连接频谱显示并控制
    url(r'^zqcontrol.html$', views.zqcontrol),  # zmq连接频谱显示并控制
    url(r'^commlink.html$', views.commlink),  # zmq通信测试
    url(r'^images/(?P<path>.*)$', serve, {"document_root": settings.STATIC_URL.strip('/') + '/images/'}),
    url(r'^js/(?P<path>.*)$', serve, {"document_root": settings.STATIC_URL.strip('/') + '/js/'}),
]