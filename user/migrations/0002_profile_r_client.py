# Generated by Django 2.0 on 2019-09-19 16:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('lot', '0001_initial'),
        ('user', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='r_client',
            field=models.ManyToManyField(blank=True, to='lot.Clients'),
        ),
    ]
