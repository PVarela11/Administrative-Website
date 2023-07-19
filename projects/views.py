from django.contrib import messages
from django.contrib.auth.mixins import LoginRequiredMixin
from django.core.paginator import Paginator

from django.urls import reverse_lazy
from django.shortcuts import render
from django.views.generic import ListView, UpdateView, DeleteView, CreateView
from django.http import HttpResponseRedirect
from django.urls import reverse

from .forms import ProjectEditForm, ProjectCreateForm
from .models import Project

# Create your views here.
class HomePage(LoginRequiredMixin, ListView):
    http_method_names=["get", "post"]
    login_url = 'account_login'
    redirect_field_name = 'account_login'
    paginate_by = 5
    template_name = "homepage.html"
    model = Project
    context_object_name = "projects"
    queryset = Project.objects.all().order_by('-id')[0:10]

class ProjectDetailView(LoginRequiredMixin, UpdateView):
    http_method_names=["get", "post"]
    model = Project
    template_name = "project/edit.html"
    form_class = ProjectEditForm
    success_url = "/"
    
    def form_valid(self, form):
        # Check the form errors
        if form.errors:
            print("The form has errors:", form.errors)
            messages.error(self.request, f'There was an error with the  "{form.instance.name}" !')
            return super().form_valid(form)

        # The form is valid, so save it and redirect the user
        response = super().form_valid(form)
        self.object = form.save()
        messages.success(self.request, f'Project "{form.instance.name}" was updated successfully!')
        return response

class ProjectDeleteView(LoginRequiredMixin, DeleteView):
    template_name = "project/delete.html"
    model = Project
    success_url = "/"

    def form_valid(self, form):
        response = super().form_valid(form)
        messages.success(self.request, 'Project was eliminated successfully')
        return response

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['delete_url'] = reverse('projects:delete', args=[self.object.pk])
        return context

class ProjectCreateView(LoginRequiredMixin, CreateView):
    model = Project
    form_class = ProjectCreateForm
    template_name = 'project/create.html'
    success_url = '/'

    def form_valid(self, form):
        response = super().form_valid(form)
        messages.success(self.request, f'Project "{form.instance.name}" was created successfully!')
        return response
    
