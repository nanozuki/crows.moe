from django.conf.urls import url
from . import views
from django.contrib.auth import views as auth_views

urlpatterns = [
    url(r'^$', views.index_view, name='index'),
    url(r'^login/\?next=(?P<next_url>.*)$', views.login_view, name='login_next'),
    url(r'^login/$', views.login_view, name='login'),
    url(r'^logout/$', views.logout_view, name='logout'),
    url(r'^(?P<user_name>\w+)/$', views.user_view, name='profile'),
]
