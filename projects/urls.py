from django.urls import path, reverse
from . import views

app_name = "projects"

urlpatterns = [
    path("", views.HomePage.as_view(), name="index"),
    path("edit/<int:pk>", views.ProjectEditView.as_view(), name="edit"),
    path("delete/<int:pk>" , views.ProjectDeleteView.as_view(), name="delete"),
    path('create/', views.ProjectCreateView.as_view(), name='create'),
]

