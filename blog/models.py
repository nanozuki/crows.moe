from django.db import models


class Author(models.Model):
    """ Article's Author """
    name = models.CharField(max_length=30)
    email = models.EmailField()

    def __str__(self):
        return self.name


class Category(models.Model):
    """ Category of Article """
    category_name = models.CharField(max_length=30)

    def __str__(self):
        return self.category_name


class Tag(models.Model):
    """ Key word of Article """
    tag_name = models.CharField(max_length=30)

    def __str__(self):
        return self.tag_name


class Article(models.Model):
    """ Blog Article """
    title = models.CharField(max_length=100)
    author = models.ForeignKey(Author)
    category = models.ForeignKey(Category)
    tags = models.ManyToManyField(Tag, blank=True)
    publish_time = models.DateTimeField(auto_now_add=True)
    last_update_time = models.DateField(auto_now=True)
    text = models.TextField()

    def __str__(self):
        return '"{0}({1})"'.format(self.title, self.author)