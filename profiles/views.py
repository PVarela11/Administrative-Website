from .forms import UserCreationFormWithProfile
from django.shortcuts import render
from django.contrib import messages
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.models import User
from django.views.generic import ListView, CreateView, DeleteView
from django.urls import reverse
#from .models import Profile


# Create your views here.
class ProfileView(LoginRequiredMixin, ListView):
    http_method_names=["get"]
    #paginate_by = 9
    template_name = "profile/dashboard.html"
    model = User
    context_object_name = "users"
    #queryset = Profile.objects.all().order_by('-id')[0:10]

    def get_queryset(self):
        return User.objects.exclude(username='admin')
    
class ProfileCreateView(LoginRequiredMixin, CreateView):
    template_name = 'profile/create.html'
    form_class = UserCreationFormWithProfile
    success_url = 'profile/dashboard.html'

    def form_valid(self, form):
        form.save()
        return super().form_valid(form)
    
class ProfileDeleteView(LoginRequiredMixin, DeleteView):
    template_name = "profile/delete.html"
    model = User
    success_url = "/"

    def form_valid(self, form):
        response = super().form_valid(form)
        messages.success(self.request, 'User was eliminated successfully')
        return response
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['delete_url'] = reverse('profiles:delete', args=[self.object.pk])
        return context
