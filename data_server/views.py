# Auth module and its methods
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required

from django.db import IntegrityError
from django.http import HttpResponse, JsonResponse, HttpResponseRedirect, FileResponse
from django.shortcuts import render, redirect
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
from django.core import serializers
from django.http.multipartparser import MultiPartParser
from .models import User, Channel, Video
import json
import os

# User Authentication views
def index(request):
    return render(request, "index.html")

def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        try:
            username = request.POST["username"]
            password = request.POST["password"]
            user = authenticate(request, username=username, password=password)
        except Exception:
            user = authenticate(request=request)
        try:
            login(request, user)
            user_obj = User.objects.get(pk=user.pk)
            user_json = {
                "id": user_obj.pk,
                "username": user_obj.username,
                "first_name": user_obj.first_name,
                "last_name": user_obj.last_name,
                "profile_picture_url": user_obj.profile_picture.url,
                "followers_count": user_obj.followers_count,
                "following_count": user_obj.following_count,
            }
            return JsonResponse({
                "user": json.dumps(user_json)
            }, status=200)
        
        except Exception:
            return JsonResponse({
                "error": "Invalid username and/or password."
            }, status=404)
    else:
        return redirect(reverse('home'))

@login_required
def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("home"))

def register(request):
    if request.method == "POST":
        # User data
        username = request.POST["username"]
        email = request.POST["email"]
        first_name = request.POST["first_name"]
        last_name = request.POST["last_name"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return JsonResponse({
                "error_password": "Passwords must match."
            }, status=403)

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.first_name = first_name
            user.last_name = last_name
            user.save()
        except IntegrityError:
            return JsonResponse({
                "error_username": "Username already taken."
            }, status=403)
        login(request, user)
        user_obj = User.objects.get(pk=user.pk)
        user_json = {
                "user_id": user.pk,
                "username": user.username,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "profile_picture_url": user.profile_picture.url,
                "followers_count": user.followers_count,
                "following_count": user.following_count
            }
        return JsonResponse({
            "user": json.dumps(user_json)
        }, status=200)
    else:
        return render(request, "index.html")
    
# API views
@csrf_exempt
def all_videos(request):
    if request.method == 'GET':
        all_videos_objs = Video.objects.all()
        print(all_videos_objs)
        all_videos_list = []
        for video in all_videos_objs:
            all_videos_list.append({
                "id": video.pk,
                "channel_id": video.channel.pk,
                "name": video.name,
                "description": video.description,
                "video_url": video.file.url,
                "thumbnail_url": video.thumbnail.url,
                "created_at": video.created_at,
                "channel_logo_url": video.channel.logo.url,
                "views": video.views
            })
        return JsonResponse({
            "all_videos": all_videos_list
        }, status=200)
    else:
        return JsonResponse({
            "error": "The '/allvideos' endpoint only supports GET requests"
        }, status=400)
    
def videos_by_channel_id(request, channel_id):
    if request.method == 'GET':
        try:
            channel = Channel.objects.get(id=channel_id)
            videos = Video.objects.filter(channel=channel)
            video_json_list = []
            for video in videos:
                video_json_list.append({
                    "id": video.pk,
                    "channel_id": video.channel.pk,
                    "channel_name": video.channel.name,
                    "channel_subs": video.channel.subscribers_count,
                    "name": video.name,
                    "description": video.description,
                    "video_url": video.file.url,
                    "thumbnail_url": video.thumbnail.url,
                    "created_at": video.created_at,
                    "channel_logo_url": video.channel.logo.url,
                    "views": video.views
                })
            return JsonResponse({
                "videos": video_json_list 
            }, status=200)
        
        except Exception:
            return JsonResponse({
                "error": "Code 404 - Channel Not Found"
            }, status=404)
        
    else:
        return JsonResponse({'error': 'Code 400 - Bad Request'}, status=400)

def video_metadata(request, id):
    if request.method == 'GET':
        try:
            video = Video.objects.get(id=id)
            video_json = {
                "id": video.pk,
                "channel_id": video.channel.pk,
                "channel_name": video.channel.name,
                "channel_subs": video.channel.subscribers_count,
                "name": video.name,
                "description": video.description,
                "video_url": video.file.url,
                "thumbnail_url": video.thumbnail.url,
                "created_at": video.created_at,
                "channel_logo_url": video.channel.logo.url,
                "views": video.views
            }
            return JsonResponse({
                    "video": video_json
            }, status=200)
        except Exception:
            return JsonResponse({
                    "error": "Error 404 - Video not found." 
            }, status=404)

    elif request.method == 'POST':
        try:
            channel_id = request.POST.get("channel_id")
            name = request.POST.get("name")
            description = request.POST.get("description")
            file = request.FILES[0]
        except Exception:
            id_error = ''
            name_error = ''
            file_error = ''
            if not channel_id:
                id_error = 'Please provide a channel id'
            if not name:
                name_error = 'Please provide a channel name (obligatory)'
            if not file:
                file_error = 'No video was uploaded , please provide a video file.'
            return JsonResponse({
                "error": "Data is not correclty provided",
                "channel_id_error": id_error,
                "name_error": name_error,
                "file_error": file_error
            })
        try:
            channel_obj = Channel.objects.get(id=channel_id)
        except Exception:
            return JsonResponse({
                "error": "404 Error - Channel not found."
            }, status=404)
        try:
            new_video = Video(
                channel=channel_obj,
                name=name,
                description=description,
                file=file
            )
            new_video.save()
            return JsonResponse({
                "ok": "Video created successfully."
            }, 200)
        except Exception:
            return JsonResponse({
                "error": "Internal Server Error 500 - Couldn't create video."
            }, status=500)

    elif request.method == 'PUT':
        # TODO
        pass
    elif request.method == 'DELETE':
        if not request.user.is_authenticated:
            return JsonResponse({
                "error": "Forbidden - User is not logged in"
            }, status=403)
        try:
            video = Video.objects.get(id=id)
        except Exception:
            return JsonResponse({
                    "error": "Error 404 - Video you're trying to delete don't exist." 
            }, status=404)
        video.delete()
        return JsonResponse({
            "ok": f"Video({video.pk}) deleted successfully"
        }, status=200)
    
def video_stream(request, id):
    range: str = request.headers.get('range')
    if range == None:
        return JsonResponse({
            "error": f"Request requires range header {range==None}"
        }, status=400)
    
    try:
        video_obj = Video.objects.get(id=id)
        video_file_path = video_obj.file.path
        print(video_obj.name, 'id=', video_obj.pk)

    except Exception:
        return JsonResponse({
            'error': '404 Video Not Found'
        }, status=404)
    
    video_size = os.path.getsize(video_file_path)

    CHUNK_SIZE = 1048576 # bytes (1MB)
    start = int(range.split('=')[1].split('-')[0])
    end = min(int(start) + CHUNK_SIZE, video_size - 1)

    try:
        response = FileResponse(open(video_file_path, 'rb'))
        response['Content-Range'] = f'bytes={start}-{end}/{video_size}'
        response['Accept-Ranges'] = 'bytes'

    except FileNotFoundError:
        return JsonResponse({
            "error": "File Not Found"
        }, status=404)

    return response
            
def channel(request, id):
    if request.method == 'GET':
        try:
            channel = Channel.objects.get(id=id)
            channel_json = {
                "id": channel.pk,
                "name": channel.name,
                "description": channel.description,
                "logo_url": channel.logo.url,
                "subscribers_count": channel.subscribers_count,
                "owner_username": channel.user.username,
                "owner_id": channel.user.pk,
                "created_at": channel.created_at.isoformat()
            }
            print(channel_json)
            return JsonResponse({
                "channel": json.dumps(channel_json)
            }, status=200)
        except Exception:
            return JsonResponse({
                "error": "Error 404 - Channel not found."
            }, status=404)
        
    elif request.method == 'DELETE':
        if not request.user.is_authenticated:
            return JsonResponse({
                "error": "Forbidden - User is not logged in"
            }, status=403)
        try:
            channel = Channel.objects.get(id=id)
            channel.delete()
            return JsonResponse({
                "ok": "Channel was deleted permanently"
            }, status=200)
        except Exception:
            return JsonResponse({
                "error": "Error 404 - Channel not found."
            }, status=404)
        
@csrf_exempt
def all_channels(request):
    if request.method == 'GET':
        try:
            all_channels_objs = Channel.objects.all()
            channels_list = []
            for channel in all_channels_objs:
                channels_list.append({
                    "id": channel.pk,
                    "name": channel.name,
                    "description": channel.description,
                    "logo_url": channel.logo.url,
                    "subscribers_count": channel.subscribers_count,
                    "owner_username": channel.user.username,
                    "owner_id": channel.user.pk,
                })
            response = JsonResponse({
                "all_channels": channels_list,
            }, status=200)
            return response
        
        except Exception:
            return JsonResponse({
                "error": "There is still no channel :)"
            }, status=200)




