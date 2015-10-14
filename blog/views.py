from django.http import HttpResponseRedirect, HttpResponse
from django.shortcuts import render, get_object_or_404
from django.core.urlresolvers import reverse
from .models import Article, Category, Tag, Comment
from .sidebar import SidebarData


def update_clicks_counter(article, delta=1):
    article.clicks += delta
    article.save()
    article.category.clicks += delta
    article.category.save()
    for tag in article.tags.all():
        tag.clicks += delta
        tag.save()


def choose_color_style(content, category):
    if category.url_name == "anime":
        content.update({'color_style': '/static/crows/color-anime.css'})
    elif category.url_name == "games":
        content.update({'color_style': '/static/crows/color-games.css'})
    elif category.url_name == "progr":
        content.update({'color_style': '/static/crows/color-progr.css'})
    elif category.url_name == "gossip":
        content.update({'color_style': '/static/crows/color-gossip.css'})


def index_view(request):
    # category_list = Category.objects.all()
    # site_title = "烏鴉的庭院"
    # return render(request, 'blog/index.html',
    #              {'category_list': category_list,
    #               'site_title': site_title})
    return HttpResponseRedirect(reverse("homepage:index"))



def category_view(request, category_url_name):
    _category = get_object_or_404(Category, url_name=category_url_name)
    category_list = Category.objects.all()
    sbd = SidebarData()
    content = sbd.gather_data(_category, need_recent_update=False)
    _category.clicks += 1
    _category.save()
    article_list = Article.objects.order_by('-publish_time').filter(category=_category)
    choose_color_style(content, _category)
    content.update({'category': _category, 'category_list': category_list, 'article_list': article_list})
    return render(request, 'blog/category.html', content)


def article_view(request, article_id):
    article = get_object_or_404(Article, pk=article_id)
    category_list = Category.objects.all()
    tags_list = article.tags.all()
    comments_list = article.comments.all()
    update_clicks_counter(article)

    sbd = SidebarData()
    content = sbd.gather_data(article.category)
    choose_color_style(content, article.category)
    content.update({'article': article,
                    'category_list': category_list,
                    'tags_list': tags_list,
                    'comments_list': comments_list})

    return render(request, 'blog/article.html', content)


def tag_view(request, tag_id):
    tag = get_object_or_404(Tag, id=tag_id)
    category_list = Category.objects.all()
    sbd = SidebarData()
    content = sbd.gather_data(tag.category, need_recent_update=False)
    tag.clicks += 1
    tag.category.clicks += 1
    tag.save()
    tag.category.save()
    article_list = Article.objects.order_by('-publish_time').filter(tags__in=[tag.id])[:]
    choose_color_style(content, tag.category)
    content.update({'tag': tag,
                    'category_list': category_list,
                    'article_list': article_list, })

    return render(request, 'blog/tag.html', content)


def post_comment(request, article_id):
    article = get_object_or_404(Article, pk=article_id)
    name = request.POST['name']
    email = request.POST['email']
    content = request.POST['content']
    if name == "":
        name = "匿名访客"

    cmt = Comment(name=name,
                  email=email,
                  content=content,
                  floor=article.comments.count() + 1,
                  reply_id=-1)
    cmt.save()
    article.add_comment(cmt)
    # This is ugly. Will be Repaired in the future.
    update_clicks_counter(article, -1)
    return HttpResponseRedirect(reverse("blog:article", args=(article_id,)) + "#lastcmt")


def post_article(request):
    return render(request, 'blog/post.html')