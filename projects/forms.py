from django import forms
from django.forms import ModelForm
from .models import Project, Client, PAYMENT_DAYS_CHOICES, TYPE_VAT_CHOICES

from crispy_forms.helper import FormHelper
from crispy_forms.layout import Submit
from django.urls import reverse

class ClientForm(ModelForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for field in self.fields.values():
            field.required = False

    class Meta:
        model = Client
        fields = '__all__'
        widgets = {
            'client_name': forms.TextInput(attrs={'class': 'form-control disable-on-select'}),
            'tax_id': forms.NumberInput(attrs={'class': 'form-control disable-on-select'}),
            'reference': forms.NumberInput(attrs={'class': 'form-control disable-on-select'}),
            'purchase_num': forms.NumberInput(attrs={'class': 'form-control disable-on-select'}),
            'project_value': forms.TextInput(attrs={'class': 'form-control disable-on-select'}),
            'hour_value': forms.TextInput(attrs={'class': 'form-control disable-on-select'}),
            'extra_costs': forms.TextInput(attrs={'class': 'form-control disable-on-select'}),
            'payment_days': forms.Select(attrs={'class': 'form-control disable-on-select'}),
            'type_vat': forms.Select(attrs={'class': 'form-control disable-on-select'}),
        }

class ProjectEditForm(forms.ModelForm):
    client = forms.ModelChoiceField(queryset=Client.objects.all(), required=False, empty_label='Create New Client')

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.client_form = ClientForm(data=kwargs.get('data'))

    def clean(self):
        cleaned_data = super().clean()
        client = cleaned_data.get('client')
        # Check if the user entered client details
        if not client:
            # Create a new client with the provided data
            client_form = ClientForm(data=self.data)
            print(client_form)
            if client_form.is_valid():
                client = client_form.save()
                cleaned_data['client'] = client
            else:
                # If the client_form is not valid, raise a validation error
                raise forms.ValidationError('Invalid client data')

        return cleaned_data

    class Meta:
        model = Project
        fields = '__all__'


class ProjectCreateForm(forms.ModelForm):
    client = forms.ModelChoiceField(queryset=Client.objects.all(), required=False, empty_label='Create New Client')

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.client_form = ClientForm(data=kwargs.get('data'))

    def clean(self):
        cleaned_data = super().clean()
        client = cleaned_data.get('client')

        # Check if the user entered client details
        if not client:
            # Create a new client with the provided data
            client_form = ClientForm(data=self.data)
            if client_form.is_valid():
                client = client_form.save()
                cleaned_data['client'] = client
            else:
                # If the client_form is not valid, raise a validation error
                raise forms.ValidationError('Invalid client data')

        return cleaned_data

    class Meta:
        model = Project
        fields = '__all__'
        error_messages = {
            'project_name': {
                'required': "Please enter a name for the project.",
                'max_length': "The project name must be no more than 240 characters.",
            },
        }
