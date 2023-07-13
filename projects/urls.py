from django.urls import path, reverse
from . import views

app_name = "projects"

urlpatterns = [
    path("", views.HomePage.as_view(), name="index"),
    path("project/<int:pk>", views.ProjectDetailView.as_view(), name="detail"),
    path("delete/<int:pk>" , views.ProjectDeleteView.as_view(), name="delete"),
    #path("create/" , views.DetailProjectView.as_view(), name="create")
    path('create/', views.ProjectCreateView.as_view(), name='create'),
]

