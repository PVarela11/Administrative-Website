from django.urls import path, reverse
from . import views

app_name = "profiles"

urlpatterns = [
    path("", views.ProfileView.as_view(), name="profiles"),
    path("create/", views.ProfileCreateView.as_view(), name="create"),
    path("delete/<int:pk>" , views.ProfileDeleteView.as_view(), name="delete"),
]
