# Generated by Django 4.2.1 on 2024-01-02 23:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('data_server', '0008_alter_video_created_at'),
    ]

    operations = [
        migrations.AddField(
            model_name='channel',
            name='created_at',
            field=models.DateTimeField(auto_now=True),
        ),
    ]
