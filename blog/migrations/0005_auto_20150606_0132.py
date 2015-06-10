# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0004_auto_20150606_0130'),
    ]

    operations = [
        migrations.AlterField(
            model_name='article',
            name='comments',
            field=models.ManyToManyField(to='blog.Comment', blank=True),
        ),
        migrations.AlterField(
            model_name='comment',
            name='reply_id',
            field=models.IntegerField(default=-1, blank=True),
        ),
    ]
