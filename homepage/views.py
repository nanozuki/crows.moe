from django.core.urlresolvers import reverse
from django.http import HttpResponseRedirect
from django.shortcuts import render
from blog.models import Article, Category

import random


def index(request):
    article_list = Article.objects.order_by('-publish_time')[:10]
    #random.shuffle(article_list)
    category_list = Category.objects.all()
    return render(request, 'homepage/index.html', {
        'site_title': "乌鸦的庭院",
        'article_list': article_list,
        'category_list': category_list,
    })


def feed(request):
    category_list = Category.objects.all()
    return render(request, 'homepage/feed.html', {
        'category_list': category_list,
        'nav_active': 'feed'
    })
