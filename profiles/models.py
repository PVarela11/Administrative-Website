from django.contrib.auth.models import User
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
#from sorl.thumbnail import ImageField

# Create your models here.
class Profile(models.Model):
    user = models.OneToOneField(
        User, 
        #verbose_name=_(""), 
        on_delete=models.CASCADE,
        related_name= "profile"
        )
    role = models.CharField(max_length=50, null=True)
    personal_contact = models.CharField(max_length=20, null=True)
    emergency_contact = models.CharField(max_length=20, null=True)
    street = models.CharField(max_length=100, null=True)
    postal_code = models.CharField(max_length=10, null=True)
    city = models.CharField(max_length=50, null=True)
    country = models.CharField(max_length=50, null=True)

    
    def __str__(self):
        return self.user.username
    
@receiver(post_save, sender=User)
def created_user_profile(sender, instance, created, **kwargs):
	"""Create a new Profile() object when Django user is created"""
	if created:
		Profile.objects.get_or_create(user=instance)
