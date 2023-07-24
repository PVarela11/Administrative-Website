from django.contrib import messages
from django.contrib.auth.mixins import LoginRequiredMixin
from django.core.paginator import Paginator
from django.db import IntegrityError
from django.template.loader import render_to_string


from django.urls import reverse_lazy
from django.shortcuts import render
from django.views.generic import ListView, UpdateView, DeleteView, CreateView
from django.http import HttpResponseRedirect,JsonResponse
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
        print(self)
        print("Sucessfull FORM")
        # Save the data to the database
        form.save()
        # Return a success response
        messages.success(self.request, f'Project "{form.instance.name}" was updated successfully!')
        # Return a success response with the success URL
        return JsonResponse({'success': True, 'success_url': self.success_url})
    
    def form_invalid(self, form):
        print("Unsucessfull FORM")
        # Return the form's errors as a JSON response
        return JsonResponse({'errors': form.errors})

class ProjectCreateView(LoginRequiredMixin, CreateView):
    model = Project
    form_class = ProjectCreateForm
    template_name = 'project/create.html'
    success_url = '/'
    
    def form_valid(self, form):
        try:
            return super().form_valid(form)
        except IntegrityError:
            form.add_error(None, 'Error: Code already exists')
            return self.form_invalid(form)
    
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
    
