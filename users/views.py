from django.shortcuts import render, get_object_or_404
from django.shortcuts import HttpResponseRedirect
from django.core.urlresolvers import reverse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from blog.models import Author, Article, Draft

def index_view(request):
    if request.user.is_authenticated():
        return HttpResponseRedirect(reverse("users:profile",
            args=(request.user.username,)))
    else:
        return HttpResponseRedirect(reverse("users:login"))


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("homepage:index"))


@login_required
def user_view(request, user_name):
    author = get_object_or_404(Author, name="结夜野棠")
    articles = author.article_set.all().order_by('-publish_time')
    drafts = author.draft_set.all().order_by('-create_time')
    return render(request, 'users/profile.html',
                  {'user_name': user_name, 'articles': articles, 'drafts': drafts})


@login_required
def article_edit(request, article_type, article_id):
    if request.user.username is not "crowstang":
        logout(request)
        HttpResponseRedirect(reverse("users:login"))

    if article_type == "article":
        article = get_object_or_404(Article, id=article_id)
    else:
        article = get_object_or_404(Draft, id=article_id)
    tags = ["{0}({1})".format(tag.tag_name, tag.category.category_name)
            for tag in article.tags.all()]
    return render(request, 'users/article_edit.html',
                  {'article':article, 'tags':tags})




