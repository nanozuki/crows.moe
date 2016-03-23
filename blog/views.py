from django.contrib.auth.decorators import login_required
from django.http import HttpResponseRedirect, JsonResponse
from django.shortcuts import render, get_object_or_404
from django.core.urlresolvers import reverse
from django.template.loader import render_to_string

from .models import Article, Category, Tag, Comment
from .sidebar import SidebarData
from .form import PostCommentForm


def update_clicks_counter(article, delta=1):
    article.clicks += delta
    article.save()
    article.category.clicks += delta
    article.category.save()
    for tag in article.tags.all():
        tag.clicks += delta
        tag.save()


def choose_color_style(content, color_scheme):
    content.update({
        'color_style': '/static/crows/color-{0}.css'.format(color_scheme)})


def index_view(request):
    return HttpResponseRedirect(reverse("homepage:index"))


def category_view(request, category_url_name):
    _category = get_object_or_404(Category, url_name=category_url_name)
    category_list = Category.objects.all()
    sbd = SidebarData()
    content = sbd.gather_data(_category, need_recent_update=False)
    _category.clicks += 1
    _category.save()
    article_list = Article.objects.order_by('-publish_time').filter(category=_category)
    # choose_color_style(content, _category.url_name)
    content.update({'category': _category,
                    'category_list': category_list,
                    'article_list': article_list})
    return render(request, 'blog/category.html', content)


def article_view(request, article_id):
    article = get_object_or_404(Article, pk=article_id)
    category_list = Category.objects.all()
    tags_list = article.tags.all()
    comments_list = article.comment_set.all()
    update_clicks_counter(article)

    name_ph = request.session.get('name', "")
    email_ph = request.session.get('email', "")

    comment_form = PostCommentForm(initial={
        'name': name_ph, 'email': email_ph})

    sbd = SidebarData()
    content = sbd.gather_data(article.category)
    if article.id == 1:
        content.update({'category_active': "",
                        'nav_active':"about"})
    content.update({'article': article,
                    'category_list': category_list,
                    'tags_list': tags_list,
                    'comments_list': comments_list,
                    'post_comment_form': comment_form,
                    })
    return render(request, 'blog/article.html', content)


def tag_view(request, tag_id):
    tag = get_object_or_404(Tag, id=tag_id)
    category_list = Category.objects.all()
    sbd = SidebarData()
    content = sbd.gather_tag_data(tag, need_recent_update=False)
    tag.clicks += 1
    tag.save()
    article_list = Article.objects.order_by('-publish_time').filter(tags__in=[tag.id])[:]
    choose_color_style(content, 'default')
    content.update({'tag': tag,
                    'category_list': category_list,
                    'article_list': article_list, })

    return render(request, 'blog/tag.html', content)


def post_comment(request, article_id, reply_id=None):
    if request.method == 'POST':
        form = PostCommentForm(request.POST)
        if form.is_valid():
            article = get_object_or_404(Article, pk=article_id)
            name = request.POST['name']
            email = request.POST['email']
            content = request.POST['content']
            target = -1

            # 保存用户填写的用户名和邮箱
            request.session['name'] = name
            request.session['email'] = email

            if name == "":
                name = "匿名访客"

            if reply_id is not None:
                target = reply_id

            cmt = Comment(name=name,
                          email=email,
                          content=content,
                          floor=article.comments_count + 1,
                          reply_id=target)
            cmt.save()
            article.add_comment(cmt)
            # This is ugly. Will be Repaired in the future.
            update_clicks_counter(article, -1)
            return HttpResponseRedirect(reverse("blog:article", args=(article_id,)) + "#lastcmt")
        else:
            article = get_object_or_404(Article, pk=article_id)
            category_list = Category.objects.all()
            tags_list = article.tags.all()
            comments_list = article.comment_set.all()
            update_clicks_counter(article)

            sbd = SidebarData()
            content = sbd.gather_data(article.category)
            choose_color_style(content, article.category.url_name)
            content.update({'article': article,
                            'category_list': category_list,
                            'tags_list': tags_list,
                            'comments_list': comments_list,
                            'post_comment_form': form})
            return render(request, 'blog/article.html', content)
    else:
        return HttpResponseRedirect(reverse("blog:article", args=(article_id,)))
