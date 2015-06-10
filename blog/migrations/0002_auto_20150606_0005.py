# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Comment',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('floor', models.IntegerField()),
                ('name', models.CharField(max_length=30)),
                ('email', models.EmailField(max_length=254)),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
                ('content', models.TextField(max_length=300)),
                ('reply_id', models.IntegerField(blank=True)),
            ],
        ),
        migrations.AddField(
            model_name='article',
            name='comments',
            field=models.ManyToManyField(to='blog.Comment', blank=True),
        ),
    ]
