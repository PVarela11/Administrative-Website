from django.urls import path
from . import views

app_name = "projects"

urlpatterns = [
    path("", views.HomePage.as_view(), name="index"),
    path("<int:pk>", views.ProjectDetailView.as_view(), name="detail")
]

