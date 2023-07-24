# Generated by Django 4.2.3 on 2023-07-24 07:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0006_alter_project_code1_alter_project_code2'),
    ]

    operations = [
        migrations.AlterField(
            model_name='project',
            name='name',
            field=models.CharField(max_length=120, unique=True),
        ),
        migrations.AddConstraint(
            model_name='project',
            constraint=models.UniqueConstraint(fields=('code1', 'code2'), name='unique_code'),
        ),
    ]