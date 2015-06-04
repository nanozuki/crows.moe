__author__ = 'Crows'
from django import template
from django.template.defaultfilters import stringfilter
from django.utils.safestring import mark_safe

import markdown

register = template.Library()

@register.filter(is_safe=True)
@stringfilter
def markdown2html(value):
    html = markdown.markdown(value)
    return mark_safe(html)