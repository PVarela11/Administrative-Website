from django import forms
from django.forms import ModelForm
from .models import Project

from crispy_forms.helper import FormHelper
from crispy_forms.layout import Submit
from django.urls import reverse

class ProjectEditForm(ModelForm):
    def clean(self):
        cleaned_data = super().clean()
        # Add your custom validation code here
        return cleaned_data

    class Meta:
        model = Project
        fields = '__all__'
        

class ProjectCreateForm(ModelForm):
    class Meta:
        model = Project
        fields = '__all__'
        error_messages = {
            'name': {
                'required': "Please enter a name for the project.",
                'max_length': "The project name must be no more than 240 characters.",
            },
        }