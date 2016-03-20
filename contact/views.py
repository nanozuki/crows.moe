from django.core.urlresolvers import reverse
from django.http import HttpResponseRedirect
from django.shortcuts import render
from blog.models import Category
from .models import PublicMessage, PrivateMessage
from .form import PostMessageForm


def index(request):
    category_list = Category.objects.all()
    pub_msg_list = PublicMessage.objects.order_by("-timestamp")

    name_value = request.session.get('name', '')
    email_value = request.session.get('email', '')

    form = PostMessageForm(initial={
        'name': name_value, 'email': email_value})

    return render(request, 'contact/index.html', {
        'category_list': category_list,
        'pub_msg_list': pub_msg_list,
        'post_msg_form': form,
    })


def post_msg(request, reply_id=None):
    if request.method == 'POST':
        form = PostMessageForm(request.POST)
        if form.is_valid():
            name = request.POST['name']
            email = request.POST['email']
            content = request.POST['content']
            target = -1

            request.session['name'] = name
            request.session['email'] = email

            if name == "":
                name = "匿名访客"

            if reply_id is not None:
                target = reply_id

            msg = PublicMessage(name=name,
                                email=email,
                                content=content,
                                reply_id=target)
            msg.save()
            return HttpResponseRedirect(reverse("contact:index"))
        else:
            category_list = Category.objects.all()
            pub_msg_list = PublicMessage.objects.order_by("-timestamp")
            return render(request, 'contact/index.html', {
                    'category_list': category_list,
                    'pub_msg_list': pub_msg_list,
                    'post_msg_form': form,
            })
    else:
        return HttpResponseRedirect(reverse("contact:index"))
