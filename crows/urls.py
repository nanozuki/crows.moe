from django.conf.urls import url
from . import views
from django.contrib.auth import views as auth_views

urlpatterns = [
    url(r'^$', views.index_view, name='index'),
    url(r'^login/$', auth_views.login,
        {'template_name': 'crows/login.html'}, name='login'),
    url(r'^logout/$', views.logout_view, name='logout'),
    url(r'^edit/(?P<article_type>\w+)/(?P<article_id>\d+)/$',
        views.article_edit, name="article_edit"),
    url(r'^upload_image/$', views.upload_image, name='upload_image')
]
