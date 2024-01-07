from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('register', views.register, name='register'),
    path('login', views.login, name='login'),
    path('logout', views.logout, name='logout'),
    
    # API routes
    path('all_videos', views.all_videos, name='all_videos'),
    path('video_metadata/<int:id>', views.video_metadata, name='video'),
    path('videos_by_channel_id/<int:channel_id>', views.videos_by_channel_id, name='videos_by_channel_id'),
    path('video_stream/<int:id>', views.video_stream, name='watch'),
    path('all_channels', views.all_channels, name='all_channel'),
    path('channel/<int:id>', views.channel, name='channel')
]