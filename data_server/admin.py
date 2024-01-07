from django.contrib import admin
from data_server.models import User, Channel, Video

# Register your models here.
admin.site.register(User)
admin.site.register(Channel)
admin.site.register(Video)