from django.shortcuts import render
from django.shortcuts import HttpResponseRedirect
from django.core.urlresolvers import reverse
from django.contrib.auth import authenticate, login


def index_view(request):
    return HttpResponseRedirect(reverse("users:login"))


def login_view(request):
    return render(request, 'users/login.html')


def login_form(request):
    username = request.POST['username']
    password = request.POST['password']
    user = authenticate(username=username, password=password)
    if user is not None:
        if user.is_active:
            login(request, user)
            return HttpResponseRedirect(reverse("users:profile", args=(username,)))

    return HttpResponseRedirect(reverse("users:login"))


def user_view(request, user_name):
    return render(request, 'users/profile.html',
                  {'user_name': user_name})
