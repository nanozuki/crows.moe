from django.shortcuts import render
from blog.models import Article, Category, Tag

def index(request):
    try:
        tag_aboutme = Tag.objects.get(tag_name='关于')
        article_list = tag_aboutme.article_set.order_by("-last_update_time")
        if len(article_list) > 0:
            article = article_list[0]
            article.clicks += 1
            article.category.clicks += 1
            tag_aboutme.clicks += 1
            article.save()
            article.category.save()
            tag_aboutme.save()
            return render(request, 'homepage/index.html', {
                'article': article_list[0]
            })
        else:
            return render(request, 'homepage/index.html')
    except Tag.DoesNotExist:
        return render(request, 'homepage/index.html')