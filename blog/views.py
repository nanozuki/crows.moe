from django.shortcuts import render, get_object_or_404
from .models import Article, Category


def category_view(request, category_id):
    _category = get_object_or_404(Category, pk=category_id)
    category_list = Category.objects.all()
    recent_update = Article.objects.order_by('-publish_time').filter(category=_category)
    if len(recent_update) > 5:
        recent_update = recent_update[:5]
    return render(request, 'blog/category.html', {'category': _category,
                                                  'category_list':category_list,
                                                  'recent_update': recent_update})


def article_view(request, article_id):
    article = get_object_or_404(Article, pk=article_id)
    category_list = Category.objects.all()
    return render(request, 'blog/article.html',
                  {'article': article,
                   'category_list': category_list})
