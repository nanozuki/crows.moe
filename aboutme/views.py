from django.shortcuts import render
from blog.models import Article, Category, Tag


def index(request):
    category_list = Category.objects.all()
    try:
        tag_aboutme = Tag.objects.get(tag_name='关于')
        article_list = tag_aboutme.article_set.order_by("-last_update_time")
        if len(article_list) > 0:
            return render(request, 'aboutme/index.html', {
                'category_list': category_list,
                'article': article_list[0]
            })
        else:
            return render(request, 'aboutme/index.html', {'category_list': category_list})
    except Tag.DoesNotExist:
        return render(request, 'aboutme/index.html', {'category_list': category_list})