# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0003_auto_20150606_0126'),
    ]

    operations = [
        migrations.AlterField(
            model_name='article',
            name='comments',
            field=models.ManyToManyField(to='blog.Comment', null=True),
        ),
    ]
