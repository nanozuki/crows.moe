from django.http import HttpResponseRedirect, HttpResponse
from django.shortcuts import render, get_object_or_404
from django.core.urlresolvers import reverse
from .models import Article, Category, Tag, Comment


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
    tags_list = article.tags.all()
    comments_list = article.comments.all()
    return render(request, 'blog/article.html',
                  {'article': article,
                   'category_list': category_list,
                   'tags_list': tags_list,
                   'comments_list': comments_list})


def post_comment(request, article_id):
    article = get_object_or_404(Article, pk=article_id)
    if 'visitor_name' in request.POST:
        name = request.POST['visitor_name']
    else:
        name = 'Anonymous'

    if 'visitor_email' in request.POST:
        email = request.POST['visitor_email']
    else:
        email = ''

    if 'content' in request.POST:
        content = request.POST['content']
    else:
        content = ''

    cmt = Comment(floor=article.comments.count(),
                  name=name,
                  email=email,
                  content=content)
    cmt.save()
    article.comments.add(Comment.objects.get(id=cmt.id))
    return HttpResponseRedirect(reverse('blog:article', args=(article_id,)) + '#lastcmt')
