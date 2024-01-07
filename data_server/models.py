from django.contrib.auth.models import AbstractUser
from django.db import models
from django.forms import ModelForm
from django import forms

# Create your models here.
class User(AbstractUser):
    def __str__(self) -> str:
        full_name = f'{self.first_name} {self.last_name}'if self.first_name or self.last_name else None
        return f"{self.username} ({full_name})"
    
class Channel(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.DO_NOTHING,
        related_name='channels'
    )
    name = models.CharField(
        max_length=50,
        blank=False,
        null=False,
        unique=True
    )
    description = models.CharField(
        max_length=2500,
        blank=True,
        null=True
    )
    logo = models.ImageField(
        upload_to='channels/logos',
        blank=False,
        null=False,
        default='logos/default.jpeg'
    )
    subscribers_count = models.IntegerField(
        default=0,
        null=False,
        blank=False
    )
    created_at = models.DateTimeField(
        auto_now_add=True
    )
    def __str__(self) -> str:
        return f'{self.name}'

class Video(models.Model):
    channel = models.ForeignKey(
        Channel,
        on_delete=models.CASCADE,
        related_name='videos',
        null=False
    )
    name = models.CharField(
        max_length=150,
        blank=False,
        null=False
    )
    description = models.CharField(
        max_length=250,
        blank=True,
        null=True
    )
    file = models.FileField(
        upload_to='videos',
        blank=False,
        null=False
    )
    thumbnail = models.ImageField(
        upload_to='thumbnails',
        blank=False,
        null=False,
        default='thumbnails/default_image_thumbnail.png'
    )
    views = models.IntegerField(
        default=0,
        null=False
    )
    created_at = models.DateTimeField(
        auto_now_add=True
    )
