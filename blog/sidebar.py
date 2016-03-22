__author__ = 'TangWenhan'
from .models import Article, Category, Comment, Tag


class SidebarData:
    def __init__(self):
        self.most_clicks_articles = None
        self.most_clicks_tags = None
        self.most_commented = None
        self.recent_update = None

    def gather_data(self, category,
                    need_most_clicks_articles=True,
                    need_most_clicks_tags=True,
                    need_most_commented=True,
                    need_recent_update=True,
                    most_clicks_articles_cnt=5,
                    most_clicks_tags_cnt=5,
                    most_commented_cnt=5,
                    recent_update_cnt=5):
        content = {'nav_active':'blog',
                   'category_active': category.url_name}
        if need_most_clicks_articles is True:
            self.most_clicks_articles = Article.objects.order_by('-clicks').filter(
                category=category)[:most_clicks_articles_cnt]
            content['most_clicks_articles'] = self.most_clicks_articles

        if need_most_clicks_tags is True:
            self.most_clicks_tags = \
                Tag.objects.order_by('-clicks')[:most_clicks_tags_cnt]
            content['most_clicks_tags'] = self.most_clicks_tags

        if need_most_commented is True:
            self.most_commented = Article.objects.order_by('-comments_count').filter(
                category=category)[:most_commented_cnt]
            content['most_commented'] = self.most_commented

        if need_recent_update is True:
            self.recent_update = Article.objects.order_by('-publish_time').filter(
                category=category)[:recent_update_cnt]
            content['recent_update'] = self.recent_update

        return content

    def gather_tag_data(self, tag,
                    need_most_clicks_articles=True,
                    need_most_clicks_tags=True,
                    need_most_commented=True,
                    need_recent_update=True,
                    most_clicks_articles_cnt=5,
                    most_clicks_tags_cnt=5,
                    most_commented_cnt=5,
                    recent_update_cnt=5):
        content = {}
        if need_most_clicks_articles is True:
            self.most_clicks_articles =\
                tag.article_set.order_by('-clicks')[:most_clicks_articles_cnt]
            content['most_clicks_articles'] = self.most_clicks_articles

        if need_most_clicks_tags is True:
            self.most_clicks_tags = \
                Tag.objects.order_by('-clicks')[:most_clicks_tags_cnt]
            content['most_clicks_tags'] = self.most_clicks_tags

        if need_most_commented is True:
            self.most_commented = tag.article_set.order_by(
                        '-comments_count')[:most_commented_cnt]
            content['most_commented'] = self.most_commented

        if need_recent_update is True:
            self.recent_update = tag.article_set.order_by(
                    '-publish_time')[:recent_update_cnt]
            content['recent_update'] = self.recent_update

        return content
