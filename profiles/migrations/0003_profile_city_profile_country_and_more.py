# Generated by Django 4.2.3 on 2023-08-04 08:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('profiles', '0002_alter_profile_user'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='city',
            field=models.CharField(max_length=50, null=True),
        ),
        migrations.AddField(
            model_name='profile',
            name='country',
            field=models.CharField(max_length=50, null=True),
        ),
        migrations.AddField(
            model_name='profile',
            name='emergency_contact',
            field=models.CharField(max_length=20, null=True),
        ),
        migrations.AddField(
            model_name='profile',
            name='personal_contact',
            field=models.CharField(max_length=20, null=True),
        ),
        migrations.AddField(
            model_name='profile',
            name='postal_code',
            field=models.CharField(max_length=10, null=True),
        ),
        migrations.AddField(
            model_name='profile',
            name='street',
            field=models.CharField(max_length=100, null=True),
        ),
    ]
