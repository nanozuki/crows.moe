# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0002_auto_20150606_0005'),
    ]

    operations = [
        migrations.AlterField(
            model_name='article',
            name='comments',
            field=models.ManyToManyField(default=-1, to='blog.Comment', blank=True),
        ),
    ]
