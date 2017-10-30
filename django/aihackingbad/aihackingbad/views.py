from django.http import HttpResponse
from django.shortcuts import render

# from aihackingbad.deeplearning import main


def index(request):
    return render(request, 'aihackingbad/index.html')
    # return HttpResponse('HELLO')


def temp(request):
    return HttpResponse('hello1')