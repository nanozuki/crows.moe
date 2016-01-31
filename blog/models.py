from django.db import models


class Author(models.Model):
    """ Article's Author """
    name = models.CharField(max_length=30)
    email = models.EmailField()

    def __str__(self):
        return self.name


class Category(models.Model):
    """ Category of Article """
    url_name = models.CharField(max_length=10, unique=True)
    category_name = models.CharField(max_length=30)
    brief = models.CharField(max_length=70, blank=True)
    clicks = models.IntegerField(default=0)

    def __str__(self):
        return self.category_name


class Tag(models.Model):
    """ Key word of Article """
    tag_name = models.CharField(max_length=30)
    clicks = models.IntegerField(default=0)
    category = models.ForeignKey(Category, null=True)

    def __str__(self):
        return "{0}({1})".format(self.tag_name, self.category.category_name)

class TagsTip(models.Model):
    """ Tips For tag """
    tag_name = models.CharField(max_length=30)
    tip = models.TextField(blank=True)


class Article(models.Model):
    """ Blog Article """
    title = models.CharField(max_length=100)
    author = models.ForeignKey(Author)
    category = models.ForeignKey(Category)
    tags = models.ManyToManyField(Tag, blank=True)
    publish_time = models.DateTimeField(auto_now_add=True)
    last_update_time = models.DateField(auto_now=True)
    abstract = models.TextField(blank=True)
    text = models.TextField()
    comments_count = models.IntegerField(default=0)
    clicks = models.IntegerField(default=0)

    def __str__(self):
        return '"{0}({1})"'.format(self.title, self.author)

    def add_comment(self, comment):
        self.comment_set.add(Comment.objects.get(id=comment.id))
        self.comments_count += 1
        self.save()


class Comment(models.Model):
    """ Comments of Article """
    article = models.ForeignKey(Article, default=1)
    floor = models.IntegerField()
    name = models.CharField(max_length=30, default="匿名访客")
    email = models.EmailField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    content = models.TextField(max_length=300)
    reply_id = models.IntegerField(default=-1)

    def __str__(self):
        return self.content
