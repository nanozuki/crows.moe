from django.shortcuts import render
from blog.models import Category


def index(request):
    category_list = Category.objects.all()
    site_title = "烏鴉的庭院"
    return render(request, 'homepage/index.html',
                  {'category_list': category_list,
                   'site_title': site_title})