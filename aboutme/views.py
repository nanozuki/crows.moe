from django.shortcuts import render
from blog.models import Category


def index(request):
    category_list = Category.objects.all()
    return render(request, 'aboutme/index.html', {'category_list': category_list})
