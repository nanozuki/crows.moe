from django.shortcuts import HttpResponseRedirect
from django.core.urlresolvers import reverse


def index(request):
    return HttpResponseRedirect(reverse("homepage:index") + "#about")
