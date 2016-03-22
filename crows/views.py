import os
import datetime
import pytz
import time
from django.http import Http404, HttpResponse
from django.shortcuts import render, get_object_or_404
from django.shortcuts import HttpResponseRedirect
from django.core.urlresolvers import reverse
from django.contrib.auth import logout
from django.contrib.auth.decorators import login_required

from blog.models import Author, Article, Draft, Category, Tag


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("homepage:index"))


@login_required
def index_view(request):
    author = get_object_or_404(Author, name="结夜野棠")
    articles = author.article_set.all().order_by('-publish_time')
    drafts = author.draft_set.all().order_by('-create_time')
    category_list = Category.objects.all()
    return render(request, 'crows/profile.html',
                  {'user_name': "结夜野棠", 'articles': articles,
                   'drafts': drafts, 'nav_active': 'courtyard',
                   'category_list': category_list})


def deal_article_tags(article, tags):
    tag_list = tags.split()
    article.tags.clear()
    for tag_name in tag_list:
        if Tag.objects.filter(tag_name=tag_name).exists():
            tag = Tag.objects.get(tag_name=tag_name)
            article.tags.add(tag)
        else:
            article.tags.create(tag_name=tag_name)


def article_save(request, article_type, article_id):
    author = Author.objects.get(name='结夜野棠')
    category = Category.objects.get(url_name=request.POST['category'])
    if article_type == 'new':
        article = Draft(title=request.POST['title'],
                        author=author,
                        category=category,
                        abstract=request.POST['abstract'],
                        text=request.POST['content'])
        article_id = article.id
        print("new draft id={0}".format(article_id))
        article.save()
        article_type = 'draft'
    else:
        if article_type == 'article':
            article = Article.objects.get(id=article_id)
        else:
            article = Draft.objects.get(id=article_id)
        article.title = request.POST['title']
        article.author = author
        article.category = category
        article.abstract = request.POST['abstract']
        article.text = request.POST['content']

    tags = request.POST['tags']
    deal_article_tags(article, tags)

    if article_type == 'article':
        article.last_update_time = \
            datetime.datetime.now(pytz.utc)
    article.save()
    if article_type == 'draft':
        return HttpResponse(reverse("crows:index"))
    else:
        return HttpResponse(reverse("blog:article", args=(article_id,)))


def article_publish(request, article_type, article_id):
    author = Author.objects.get(name='结夜野棠')
    category = Category.objects.get(url_name=request.POST['category'])
    article = Article(title=request.POST['title'],
                      author=author,
                      category=category,
                      abstract=request.POST['abstract'],
                      text=request.POST['content'])
    article.save()
    if article_type == "draft":
        Draft.objects.get(id=article_id).delete()

    tags = request.POST['tags']
    deal_article_tags(article, tags)

    article.last_update_time = article.publish_time
    article.save()

    return HttpResponse(reverse("blog:article", args=(article.id,)))


def image_upload_handle(image):
    print("image name is {0}".format(image.name))
    ex_name = os.path.splitext(image.name)
    file_name = "{0}.{1}".format(int(time.time()), ex_name)
    print("filename is {0}".format(file_name))
    with open(file_name, 'wb+') as dst:
        for chunk in image.chunks():
            dst.write(chunk)
        return file_name


@login_required
def article_edit(request, article_type, article_id):
    category_list = Category.objects.all()
    if request.method == 'POST':
        action = request.POST['action']
        if action == 'preview':
            return render(request, 'crows/preview.html',
                          {'preview':request.POST['content'],
                           'nav_active': 'courtyard',
                           'category_list': category_list})
        elif action == 'save':
            return article_save(request, article_type, article_id)
        elif action == 'publish':
            return article_publish(request, article_type, article_id)
        elif action == 'delete':
            if article_type == "draft":
                Draft.objects.get(pk=article_id).delete()
            else:
                Article.objects.get(pk=article_id).delete()
            return HttpResponse(reverse("crows:index"))
        else:
            raise Http404("Valid Action!")
    else:
        if article_type == "new":
            article = None
            tags = ""
            the_category = "anime"
        elif article_type == "article":
            article = get_object_or_404(Article, id=article_id)
            tags = "  ".join("{0}".format(tag.tag_name) for tag in article.tags.all())
            the_category = article.category.url_name
        elif article_type == "draft":
            article = get_object_or_404(Draft, id=article_id)
            tags = "  ".join("{0}".format(tag.tag_name) for tag in article.tags.all())
            the_category = article.category.url_name
        else:
            raise Http404("Valid Action")
        return render(request, 'crows/article_edit.html',
                      {'article': article, 'tags': tags, 'type': article_type,
                       'categorise': category_list, 'the_category': the_category,
                       'nav_active': 'courtyard', 'category_list': category_list})
