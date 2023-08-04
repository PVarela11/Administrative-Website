from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from .models import Profile

class UserCreationFormWithProfile(UserCreationForm):
    first_name = forms.CharField(max_length=30, required=True)
    last_name = forms.CharField(max_length=30, required=True)
    email = forms.EmailField(required=True)
    role = forms.CharField(max_length=50, required=False)
    personal_contact = forms.CharField(max_length=20, required=False)
    emergency_contact = forms.CharField(max_length=20, required=False)
    street = forms.CharField(max_length=100, required=False)
    postal_code = forms.CharField(max_length=10, required=False)
    city = forms.CharField(max_length=50, required=False)
    country = forms.CharField(max_length=50, required=False)

    class Meta:
        model = User
        fields = ('username', 'first_name', 'last_name', 'email', 'password1', 'password2')

    def save(self, commit=True):
        user = super().save(commit=False)
        user.first_name = self.cleaned_data['first_name']
        user.last_name = self.cleaned_data['last_name']
        user.email = self.cleaned_data['email']
        if commit:
            user.save()
            profile = user.profile
            profile.role = self.cleaned_data['role']
            profile.personal_contact = self.cleaned_data['personal_contact']
            profile.emergency_contact = self.cleaned_data['emergency_contact']
            profile.street = self.cleaned_data['street']
            profile.postal_code = self.cleaned_data['postal_code']
            profile.city = self.cleaned_data['city']
            profile.country = self.cleaned_data['country']
            profile.save()
        return user
