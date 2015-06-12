# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0009_tag_category'),
    ]

    operations = [
        migrations.AddField(
            model_name='article',
            name='comments_count',
            field=models.IntegerField(default=0),
        ),
    ]
