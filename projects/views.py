from django.contrib import messages
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.models import User
from django.core.paginator import Paginator
from django.db import IntegrityError
from django.template.loader import render_to_string

from django.urls import reverse_lazy
from django.shortcuts import render, get_object_or_404
from django.views.generic import ListView, UpdateView, DeleteView, CreateView, View, DetailView
from django.http import HttpResponseRedirect,JsonResponse
from django.urls import reverse

from .forms import ProjectEditForm, ProjectCreateForm, ActivityForm
from .models import Project, Client

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

class ProjectCreateView(LoginRequiredMixin, CreateView):
    model = Project
    form_class = ProjectCreateForm
    template_name = 'project/create.html'
    success_url = '/'
    
    def get_initial(self):
        # Set the initial data for the form
        initial_data = {
            'code1': 'MCAAL',
            'code2': 'EAS1',
            'project_name': 'Default Project',
            'manager': User.objects.first(),
            'description': 'Project Description',
            'type': '1',
            'is_external': True,
            'is_rd': '1',
            'start_date': '2022-01-01',
            'end_date': '2022-12-31',
            'status': '1',
            'payment': '1',
            'visibility': '1',
            'travel_time': 50,
            'long_time': 150,
            'extra_time': 200,
            'weekend_time': 20,
        }       
        return initial_data

    def form_valid(self, form):
        print("Successfull FORM")
        # Save the data to the database
        form.save()
        # Return a success response
        messages.success(self.request, f'Project "{form.instance.project_name}" was created successfully!')
        # Return a success response with the success URL
        return JsonResponse({'success': True, 'success_url': self.success_url})

    def form_invalid(self, form):
        print("Unsucessfull FORM")
        # Return the form's errors as a JSON response
        return JsonResponse({'errors': form.errors})
 
class ProjectEditView(LoginRequiredMixin, UpdateView):
    http_method_names=["get", "post"]
    model = Project
    template_name = "project/edit.html"
    form_class = ProjectEditForm
    success_url = "/"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['users'] = User.objects.all()
        project = self.get_object()
        activities = project.activities.all()
        context['activities'] = activities
        #context['users'] = User.objects.exclude(is_superuser=True)
        #User.objects.exclude(username='admin')
        return context

    
    def form_valid(self, form):
        print("Sucessfull FORM")
        # Save the data to the database
        form.save()
        # Return a success response
        messages.success(self.request, f'Project "{form.instance.project_name}" was updated successfully!')
        # Return a success response with the success URL
        return JsonResponse({'success': True, 'success_url': self.success_url})
    
    def form_invalid(self, form):
        print("Unsuccessfull FORM")
        # Return the form's errors as a JSON response
        print(form.errors)
        return JsonResponse({'errors': form.errors})

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

class ProjectSummaryView(LoginRequiredMixin, DetailView):
    template_name = 'project/summary.html'
    model = Project

class GetClientView(View):
    def get(self, request, client_id):
        client = get_object_or_404(Client, pk=client_id)
        data = {
            'client_name': client.client_name,
            'tax_id': client.tax_id,
            'reference': client.reference,
            'purchase_num': client.purchase_num,
            'project_value': str(client.project_value),
            'hour_value': str(client.hour_value),
            'extra_costs': str(client.extra_costs),
            'payment_days': client.payment_days,
            'type_vat': client.type_vat,
        }
        return JsonResponse(data)