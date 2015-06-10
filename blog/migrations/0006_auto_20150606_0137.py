# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0005_auto_20150606_0132'),
    ]

    operations = [
        migrations.AlterField(
            model_name='comment',
            name='reply_id',
            field=models.IntegerField(default=-1),
        ),
    ]
