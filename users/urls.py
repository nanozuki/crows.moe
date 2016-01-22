from django.conf.urls import url
from . import views


urlpatterns = [
    url(r'^$', views.index_view, name='index'),
    url(r'^login/$', views.login_view, name='login'),
    url(r'^login-form/$', views.login_form, name='login-form'),
    url(r'^(?P<user_name>\w+)/$', views.user_view, name='profile'),
]
