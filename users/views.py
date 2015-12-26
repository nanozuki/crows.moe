from django.shortcuts import render
from django.shortcuts import HttpResponseRedirect
from django.core.urlresolvers import reverse
from django.contrib.auth import authenticate

def index_view(request):
    return render(request, 'users/login.html')

def login_view(request):
    return render(request, 'users/login.html')

def login_form(request):
    username = request.POST['name']
    password = request.POST['password']
    user = authenticate(username=username, password=password)
    if user is noe None:
        
    return render(request, 'users/login.html')

