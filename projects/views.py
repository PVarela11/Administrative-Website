from django.shortcuts import render

from django.views.generic import ListView, FormView
from django.contrib.auth.mixins import LoginRequiredMixin

from .forms import EditProjectForm
from .models import Project


# Create your views here.
class HomePage(LoginRequiredMixin, ListView):
    login_url = 'account_login'
    redirect_field_name = 'account_login'
    
    http_method_names=["get"]
    template_name = "homepage.html"
    model = Project
    context_object_name = "projects"
    queryset = Project.objects.all().order_by('-id')[0:10]

class ProjectDetailView(FormView):
    http_method_names=["get"]
    model = Project
    template_name = "project/detail.html"
    form_class = EditProjectForm
    success_url = "/"