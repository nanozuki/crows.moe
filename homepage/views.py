from django.shortcuts import render
from blog.models import Article, Category, Tag

def index(request):
    try:
        tag_aboutme = Tag.objects.get(tag_name='关于')
        article_list = tag_aboutme.article_set.order_by("-last_update_time")
        if len(article_list) > 0:
            return render(request, 'homepage/index.html', {
                'site_title': "乌鸦的庭院",
                'article': article_list[0],
            })
        else:
            return render(request, 'homepage/index.html')
    except Tag.DoesNotExist:
        return render(request, 'homepage/index.html')