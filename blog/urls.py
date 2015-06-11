from django.conf.urls import url
from . import views


urlpatterns = [
    url(r'^(?P<category_id>\d+)/$', views.category_view, name='category'),
    url(r'^article/(?P<article_id>\d+)/$', views.article_view, name='article'),
    url(r'^comment/(?P<article_id>\d+)/$', views.post_comment, name='comment'),
    url(r'^post/$', views.post_article, name='post_article')
]