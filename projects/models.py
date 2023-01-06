from django.db import models

# Create your models here.
class Project(models.Model):
    name = models.CharField(max_length=240)
    manager = models.CharField(max_length=240)
    start_date = models.DateField()

    def __str__(self):
        return self.name
    