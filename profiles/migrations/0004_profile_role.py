# Generated by Django 4.2.3 on 2023-08-04 13:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('profiles', '0003_profile_city_profile_country_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='role',
            field=models.CharField(max_length=50, null=True),
        ),
    ]
