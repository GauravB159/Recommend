from django.conf.urls import url
from django.contrib import admin
from django.conf.urls import include

from . import views

urlpatterns = [

	url(r'^$', views.index, name='index'),
	url(r'^upload/$', views.upload, name='upload'),
]
