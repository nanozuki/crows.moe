# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0002_article_abstract'),
    ]

    operations = [
        migrations.AddField(
            model_name='category',
            name='brief',
            field=models.CharField(blank=True, max_length=35),
        ),
    ]
