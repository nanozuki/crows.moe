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


@login_required
def user_view(request, user_name):
    return render(request, 'users/profile.html',
                  {'user_name': user_name})


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("homepage:index"))
