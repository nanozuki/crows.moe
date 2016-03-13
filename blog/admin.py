from django.contrib import admin
from blog.models import Author, Article, Category, Tag, Comment, Draft

admin.site.register(Author)
admin.site.register(Article)
admin.site.register(Draft)
admin.site.register(Category)
admin.site.register(Tag)
admin.site.register(Comment)


class ArticleAdmin(admin.ModelAdmin):
    fields = [
        (None, {'fields': ['title', 'author', 'category', 'tags', 'text', 'last_update_time']}),
        ('Time Information', {'fields': ['publish_time', 'last_update_time']}),

    ]
