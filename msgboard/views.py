from django.core.urlresolvers import reverse
from django.http import HttpResponseRedirect
from django.shortcuts import render
from blog.models import Category
from .models import PublicMessage, PrivateMessage


def index(request):
    category_list = Category.objects.all()
    pub_msg_list = PublicMessage.objects.order_by("-timestamp")
    return render(request, 'msgboard/index.html', {
        'category_list': category_list,
        'pub_msg_list': pub_msg_list})


def post_msg(request):
    name = request.POST['name']
    email = request.POST['email']
    content = request.POST['content']
    if name == "":
        name = "匿名访客"

    msg = PublicMessage(name=name,
                        email=email,
                        content=content,
                        reply_id=-1)
    msg.save()
    return HttpResponseRedirect(reverse("msgboard:index"))