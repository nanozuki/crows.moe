from django.contrib import admin
from .models import PrivateMessage, PublicMessage


# Register your models here.
admin.site.register(PrivateMessage)
admin.site.register(PublicMessage)
