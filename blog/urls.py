from django.conf.urls import url
from . import views
from .feeds import RSSFeed


urlpatterns = [
    url(r'^$', views.index_view, name='index'),
    url(r'^article/(?P<article_id>\d+)/$', views.article_view, name='article'),
    url(r'^comment/(?P<article_id>\d+)/$', views.post_comment, name='comment'),
    url(r'^tag/(?P<tag_id>\d+)/$', views.tag_view, name='tag'),
    url(r'^post/$', views.post_article, name='post_article'),
    url(r'^feed/$', RSSFeed(), name='feed'),
    url(r'^(?P<category_url_name>\w+)/$',
        views.category_view, name='category'),
]
