from django.core.urlresolvers import reverse
from django.http import HttpResponseRedirect
from django.shortcuts import render
from blog.models import Tag


def index(request):
    try:
        tag_about = Tag.objects.get(tag_name='关于')
        article_list = tag_about.article_set.order_by("-publish_time")
        if len(article_list) > 0:
            return render(request, 'homepage/index.html', {
                'site_title': "乌鸦的庭院",
                'article': article_list[0],
            })
        else:
            return render(request, 'homepage/index.html')
    except Tag.DoesNotExist:
        return render(request, 'homepage/index.html')


def about(request):
    return HttpResponseRedirect(reverse("homepage:index") + "#about")
