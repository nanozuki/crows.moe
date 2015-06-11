from django.db import models


class BaseMessage(models.Model):
    """ Base class of Message """
    name = models.CharField(max_length=30, default="匿名访客")
    email = models.EmailField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    content = models.TextField(max_length=300)
    # reply_id = models.IntegerField(default=-1)

    def __str__(self):
        return self.content

    class Meta:
        abstract = True


class PublicMessage(BaseMessage):
    """
    the type of message that will be displayed in web page
    """
    reply_id = models.IntegerField(default=-1)


class PrivateMessage(BaseMessage):
    """
    the type of message that won't be displayed in web page
    """
    # nothing extra field