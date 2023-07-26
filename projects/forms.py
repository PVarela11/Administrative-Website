from django import forms
from django.forms import ModelForm
from .models import Project, Client

from crispy_forms.helper import FormHelper
from crispy_forms.layout import Submit
from django.urls import reverse

class ClientForm(ModelForm):
    class Meta:
        model = Client
        fields = '__all__'


class ProjectEditForm(ModelForm):

    def clean(self):
        cleaned_data = super().clean()
        # Add your custom validation code here
        return cleaned_data

    class Meta:
        model = Project
        fields = '__all__'


class ProjectCreateForm(ModelForm):
    client = forms.ModelChoiceField(queryset=Client.objects.all())

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.client_form = ClientForm()
        
    class Meta:
        model = Project
        fields = '__all__'
        error_messages = {
            'name': {
                'required': "Please enter a name for the project.",
                'max_length': "The project name must be no more than 240 characters.",
            },
        }