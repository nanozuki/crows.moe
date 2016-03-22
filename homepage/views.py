from django.core.urlresolvers import reverse
from django.http import HttpResponseRedirect
from django.shortcuts import render
from blog.models import Article, Category


def index(request):
    article = Article.objects.get(pk=1)
    category_list = Category.objects.all()
    return render(request, 'homepage/index.html', {
        'site_title': "乌鸦的庭院",
        'article': article,
        'category_list': category_list,
    })


def about(request):
    return HttpResponseRedirect(reverse("homepage:index") + "#about")
