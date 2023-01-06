from django.shortcuts import render

from django.views.generic import ListView
from .models import Project

# Create your views here.
class HomePage(ListView):
    http_method_names=["get"]
    template_name = "homepage.html"
    model = Project
    context_object_name = "projects"
    queryset = Project.objects.all().order_by('-id')[0:30]