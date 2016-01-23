from django.shortcuts import render
from django.shortcuts import HttpResponseRedirect
from django.core.urlresolvers import reverse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required


def index_view(request):
    if request.user.is_authenticated():
        return HttpResponseRedirect(reverse("users:profile",
            args=(request.user.username,)))
    else:
        return HttpResponseRedirect(reverse("users:login"))


def login_view(request, next_url=None):
    if next_url is None:
        print("next url is none")
    else:
        print("next url is {0}".format(next_url))
    print("request.path is {0}".format(request.path))
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(username=username, password=password)
        if user is not None:
            if user.is_active:
                login(request, user)
                if next_url is None:
                    print("redirect to profile")
                    return HttpResponseRedirect(reverse("users:profile", args=(username,)))
                else:
                    print("redirect to next")
                    return HttpResponseRedirect(next_url)
        else:
            print("user is none")
            return HttpResponseRedirect(reverse("users:login"))
    else:
        login_url = "/user/login/"
        if next is not None:
            login_url = "/user/login/?next={0}".format(next_url)

        return render(request, 'users/login.html',
                      {'login_url': login_url})


@login_required
def user_view(request, user_name):
    return render(request, 'users/profile.html',
                  {'user_name': user_name})


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("homepage:index"))
