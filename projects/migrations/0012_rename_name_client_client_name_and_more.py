# Generated by Django 4.2.3 on 2023-07-26 13:01

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0011_project_client'),
    ]

    operations = [
        migrations.RenameField(
            model_name='client',
            old_name='name',
            new_name='client_name',
        ),
        migrations.RenameField(
            model_name='project',
            old_name='name',
            new_name='project_name',
        ),
    ]
