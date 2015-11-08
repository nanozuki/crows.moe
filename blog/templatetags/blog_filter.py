__author__ = 'Crows'
from django import template
from django.template.defaultfilters import stringfilter
from django.utils.safestring import mark_safe

import markdown

register = template.Library()


@register.filter(is_safe=True)
@stringfilter
def markdown2html(value):
    html = markdown.markdown(value, ['markdown.extensions.extra'])
    return mark_safe(html)


@register.filter()
def article_cmt_count(article):
    return article.comments.count()
