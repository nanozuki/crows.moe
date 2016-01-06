from django.core.urlresolvers import reverse
from django.http import HttpResponseRedirect
from django.shortcuts import render
from blog.models import Category
from .models import PublicMessage, PrivateMessage


def index(request):
    category_list = Category.objects.all()
    pub_msg_list = PublicMessage.objects.order_by("-timestamp")
    return render(request, 'contact/index.html', {
        'category_list': category_list,
        'pub_msg_list': pub_msg_list,
        'name': request.session.get('name', ""),
        'email': request.session.get('email', "")
    })


def post_msg(request, reply_id=None):
    name = request.POST['name']
    email = request.POST['email']
    content = request.POST['content']
    target = -1

    if name == "":
        name = "匿名访客"

    if reply_id is not None:
        target = reply_id

    request.session['name'] = name
    request.session['email'] = email

    msg = PublicMessage(name=name,
                        email=email,
                        content=content,
                        reply_id=target)
    msg.save()
    return HttpResponseRedirect(reverse("contact:index"))
