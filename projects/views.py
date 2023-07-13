from django.shortcuts import render
from django.views.generic import ListView, UpdateView, DeleteView, CreateView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import HttpResponseRedirect
from django.urls import reverse

from .forms import ProjectEditForm, ProjectCreateForm
from .models import Project

# Create your views here.
class HomePage(LoginRequiredMixin, ListView):
    login_url = 'account_login'
    redirect_field_name = 'account_login'
    paginate_by = 2
    http_method_names=["get", "post"]
    template_name = "homepage.html"
    model = Project
    #form = CreateProjectForm()
    #form_class = CreateProjectForm
    context_object_name = "projects"
    queryset = Project.objects.all().order_by('-id')[0:10]

class ProjectDetailView(LoginRequiredMixin, UpdateView):
    http_method_names=["get", "post"]
    model = Project
    template_name = "project/detail.html"
    form_class = ProjectEditForm
    success_url = "/"

class ProjectDeleteView(LoginRequiredMixin, DeleteView):
    #http_method_names= ["get"]
    template_name = "project/delete.html"
    model = Project
    success_url = "/"

class ProjectCreateView(LoginRequiredMixin, CreateView):
    model = Project
    form_class = ProjectCreateForm
    template_name = 'project/create.html'
    
