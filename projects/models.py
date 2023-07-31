from django.db import models
from django.db.models import UniqueConstraint
from django.contrib.auth.models import User

STATUS_CHOICES = (
    ("1", "Not started"),
    ("2", "Ongoing"),
    ("3", "Complete"),
)
TYPE_PROJECT_CHOICES = (
    ("1", "External project"),
    ("2", "Commencement driver assignment"),
    ("3", "Current accoutn"),
    ("4", "Internal project"),
    ("5", "Internal assignment"),
    ("6", "Master thesis"),
    ("7", "Service Ongoing"),
    ("8", "Short-term leave of absence skills development"),
)
RD_CHOICES = (
    ("1", "Not"),
    ("2", "Research"),
    ("3", "Development"),
)
PAYMENT_CHOICES = (
    ("1", "Current account"),
    ("2", "Fixed cost 30"),
    ("3", "Fixed cost 50"),
    ("4", "Fixed cost 100"),
    ("5", "Not billable"),
)
VISIBILITY_CHOICES = (
    ("1", "Visible only to the member of the project"),
    ("2", "Visible to everyone"),
)
PAYMENT_DAYS_CHOICES = (
    ("1", "Immediate"),
    ("2", "30 Days"),
    ("3", "60 Days"),
    ("4", "120 Days"),
)
#TODO: TRANSLATE TO ENGLISH#
TYPE_VAT_CHOICES = (
    ("1", "Intermédio (13%)"),
    ("2", "Isento de IVA"),
    ("3", "IVA Autoliquidação"),
    ("4", "Normal (23%)"),
    ("5", "Reduzida (6%)"),
)

# Create your models here.
class Client(models.Model):
    client_name = models.CharField(max_length=254, blank=False, null=False, unique=True)
    tax_id = models.IntegerField(blank=False, null=False)
    reference = models.IntegerField()
    purchase_num = models.IntegerField()
    project_value = models.DecimalField(max_digits=10, decimal_places=2)
    hour_value = models.DecimalField(max_digits=10, decimal_places=2)
    extra_costs = models.DecimalField(max_digits=10, decimal_places=2)
    payment_days = models.CharField(
        max_length=1,
        choices= PAYMENT_DAYS_CHOICES
    )
    type_vat = models.CharField(
        max_length=1,
        choices= TYPE_VAT_CHOICES
    )

    def __str__(self):
        return self.client_name

class Project(models.Model):
    code1 = models.CharField(max_length=5)
    code2 = models.CharField(max_length=4)
    project_name = models.CharField(max_length=120, unique=True)
    manager = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        limit_choices_to={'is_staff': False}
    )
    description = models.TextField(null=True)
    type = models.CharField(
        max_length = 1,
        choices = TYPE_PROJECT_CHOICES
    )
    is_external = models.BooleanField()
    is_rd = models.CharField(
        verbose_name="Is it research and development project ?",
        max_length=1,
        choices=RD_CHOICES
    )
    start_date = models.DateField(null=True)
    end_date = models.DateField(null=True)
    status = models.CharField(
        max_length = 1,
        choices = STATUS_CHOICES,
        default= '1'
    )
    payment = models.CharField(
        max_length=1,
        choices= PAYMENT_CHOICES
    )
    visibility = models.CharField(
        max_length=1,
        choices= VISIBILITY_CHOICES
    )
    travel_time = models.IntegerField(default=50)
    long_time = models.IntegerField(default=150)
    extra_time = models.IntegerField(default=200)
    weekend_time = models.IntegerField(default=20)
    night_time = models.IntegerField(default=40)
    client = models.ForeignKey(Client, on_delete=models.SET_NULL, null=True)
    
    class Meta:
        constraints = [
            UniqueConstraint(fields=['code1', 'code2'], name='unique_code')
        ]
        
    def __str__(self):
        return self.project_name

class Activity(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='activities')
    activity_name = models.CharField(max_length=255)
    description = models.TextField()
    responsible = models.ForeignKey(User, on_delete=models.CASCADE, related_name='activities_responsible')
    participants = models.ManyToManyField(User, related_name='activities_participant')
    
    class Meta:
         verbose_name = "Activity"
         verbose_name_plural = "Activities"

    def __str__(self):
        return self.activity_name