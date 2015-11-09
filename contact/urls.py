from django.conf.urls import url
from . import views


urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^postmsg/$', views.post_msg, name='postmsg'),
    url(r'^postmsg/(?P<reply_id>\d+)/$',
        views.post_msg, name='message-reply'),
]