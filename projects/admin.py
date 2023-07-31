from django.contrib import admin
from .models import Project, Client, Activity

# Register your models here.
class ProjectAdmin(admin.ModelAdmin):
    pass

admin.site.register(Project,ProjectAdmin)

class ClientAdmin(admin.ModelAdmin):
    pass

admin.site.register(Client,ClientAdmin)

class ActivityAdmin(admin.ModelAdmin):
    pass

admin.site.register(Activity,ActivityAdmin)