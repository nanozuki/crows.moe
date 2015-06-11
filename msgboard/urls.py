from django.conf.urls import url
from . import views


urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^postmsg/$', views.post_msg, name='postmsg'),
]