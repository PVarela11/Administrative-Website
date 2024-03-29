from django import forms
from django.forms import ModelForm, formset_factory

from .models import Project, Client, Activity, PAYMENT_DAYS_CHOICES, TYPE_VAT_CHOICES

from crispy_forms.helper import FormHelper
from crispy_forms.layout import Submit
from django.urls import reverse

class ActivityForm(forms.ModelForm):
    class Meta:
        model = Activity
        fields = '__all__'
        exclude = ['project']

ActivityFormSet = formset_factory(ActivityForm, extra=1)

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
    client_name = forms.CharField(required=False)
    

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.client_form = ClientForm(data=kwargs.get('data'))
        self.activity_forms = ActivityFormSet(data=kwargs.get('data'), prefix='activity')

    def save(self, commit=True):
        # Save the project instance
        project = super().save(commit)

        # Handle the data from the ActivityFormSet
        activity_forms = ActivityFormSet(data=self.data, prefix='activity')
        if activity_forms.is_valid():
            # Keep track of the activity instances that are in the form
            activity_instances = []

            # Save or update the activities
            for activity_form in activity_forms[:-1]:
                activity = activity_form.save(commit=False)
                activity.project = project
                activity.save()
                # Save many-to-many fields
                activity_form.save_m2m()

                # Add the activity instance to the list of instances in the form
                activity_instances.append(activity)

            # Delete any activities that are not in the form
            print(project.activities.all())
            print(activity_instances)
            for activity in project.activities.all():
                if activity not in activity_instances:
                    print(activity)
                    activity.delete()
        else:
            # If the formset is not valid, raise a validation error
            raise forms.ValidationError(activity_forms.errors)

        return project


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
                raise forms.ValidationError(client_form.errors)

        return cleaned_data

    class Meta:
        model = Project
        fields = '__all__'

class ProjectCreateForm(forms.ModelForm):
    client = forms.ModelChoiceField(queryset=Client.objects.all(), required=False, empty_label='Create New Client')

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.client_form = ClientForm(data=kwargs.get('data'))
        self.activity_forms = ActivityFormSet(data=kwargs.get('data'), prefix='activity')

    def save(self, commit=True):
        # Save the project instance
        project = super().save(commit)

        # Handle the data from the ActivityFormSet
        activity_forms = ActivityFormSet(data=self.data, prefix='activity')
        if activity_forms.is_valid():
            # Save the activities
            for activity_form in activity_forms[:-1]:
                activity = activity_form.save(commit=False)
                activity.project = project
                activity.save()
                # Save many-to-many fields
                activity_form.save_m2m()
        else:
            # If the formset is not valid, raise a validation error
            raise forms.ValidationError(activity_forms.errors)

        return project

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
                raise forms.ValidationError(client_form.errors)
            
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
