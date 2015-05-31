from django.contrib import admin
from blog.models import Author, Article, Category, Tag

admin.site.register(Author)
admin.site.register(Article)
admin.site.register(Category)
admin.site.register(Tag)


class ArticleAdmin(admin.ModelAdmin):
    fields = [
        (None, {'fields': ['title', 'author', 'category', 'tags', 'text']}),
        ('Time Information', {'fields': ['publish_time', 'last_update_time']}),

    ]