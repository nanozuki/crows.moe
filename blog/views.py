from django.shortcuts import render, get_object_or_404
from .models import Article, Category


def category_view(request, category_id):
    category = get_object_or_404(Category, pk=category_id)
    return render(request, 'blog/category.html', {'category': category})


def article_view(request, article_id):
    article = get_object_or_404(Article, pk=article_id)
    return render(request, 'blog/article.html', {'article': article})
