from django.contrib.syndication.views import Feed
from django.core.urlresolvers import reverse
from .models import Article, Category


class RSSFeed(Feed):
    title = "乌鸦的庭院：结夜野棠的个人网站"
    link = "feeds/posts/"
    description_template = "乌鸦的庭院博客文章的更新"

    def items(self):
        return Article.objects.order_by('-publish_time')[:20]

    def item_title(self, item):
        return "{0}({1})".format(item.title,
            item.category.category_name)

    def item_description(self, item):
        return item.abstract

    def item_link(self, item):
        return reverse("blog:article", args=[item.pk, ])
