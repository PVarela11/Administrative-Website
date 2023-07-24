# Generated by Django 4.2.3 on 2023-07-20 14:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0004_remove_project_group_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='project',
            name='status',
            field=models.CharField(choices=[('1', 'Not started'), ('2', 'Ongoing'), ('3', 'Complete')], default='1', max_length=1),
        ),
    ]