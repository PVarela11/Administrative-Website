from django.shortcuts import render

from django.views.generic import ListView, DetailView, UpdateView, FormView, DeleteView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import HttpResponseRedirect

from .forms import EditProjectForm
from .models import Project

# Create your views here.
class HomePage(LoginRequiredMixin, ListView):
    login_url = 'account_login'
    redirect_field_name = 'account_login'
    paginate_by = 2
    http_method_names=["get"]
    template_name = "homepage.html"
    model = Project
    context_object_name = "projects"
    queryset = Project.objects.all().order_by('-id')[0:10]

class ProjectDetailView(LoginRequiredMixin, UpdateView):
    http_method_names=["get", "post"]
    model = Project
    template_name = "project/detail.html"
    form_class = EditProjectForm
    success_url = "/"

class DeleteProjectView(LoginRequiredMixin, DeleteView):
    #http_method_names= ["get"]
    template_name = "project/delete.html"
    model = Project
    success_url = "/"
