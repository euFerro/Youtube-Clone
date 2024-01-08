# Harvard CS50 Web Project 5 (6 out of 6)
###### Youtube Like Streaming Service

## Summary
This project is a youtube like streaming platform designed with Angular in the frontend and
Django in the backend whereas Django manages the metadata using it's built-in Model classes ORM (Object Relational Mapper) and
sqlite in the local server (but it could've been any other local or SaaS database) and Angular to build the frontend using google tools
like the real youtube does.

## Distinctiveness and Complexity
Since this project is not meant to be similar to an e-commerce or a social media i decided to build a streamming service in the simplest
way possible. I think the distinctiveness of this project speaks for itself, although i didn't had to build from scratch a video player nor
build tools for video editing or some form of manipulaiton, i decided to handle the creation of the metadata for a video and link it to a specific
channel and actually store the video in the server and stream the video, so the complexity was this, link the channel and video metadata to
the actual video streaming route so that the video chunk is sent to the browser to be played.

## How to build and/or run the application
If the project you downloaded doesn't contain the dist folder that is the built frontend you should build it by goinf into the frontend folder ```cd frontend``` and then build it by running one of these commands ```ng build``` or ```ng b``` after the build is done go back to the root of the project ```cd ..``` and run ```python manage.py runserver```, you can use "py" or "python3" depending on your python version or set aliases for the python version.

## Components of the application
### Frontend
In the frontend there are a few angular components (they are separeted in two folders "types" pages or shared):
#### Pages
* homepage
* channellistpage (a list of channels)
* channelpage (the channel specific page)
* videoplayer

#### Shared
* videobox
* channelbox
* navbar
* profilephoto

#### videobox.component.ts
It is a representaion of the video thumbnail and other info like views and title:
```ts
import { AfterViewInit, Component, INJECTOR, Input, OnInit } from '@angular/core';
import { getTimeDiffFromNow, getFormattedNumber } from "src/utils/formatter";

@Component({
  selector: 'app-videobox',
  templateUrl: './videobox.component.html',
  styleUrls: ['./videobox.component.scss']
})
export class VideoboxComponent implements OnInit, AfterViewInit {
  @Input() video_id: number | undefined = undefined;
  @Input() channel_id: number | undefined = undefined;
  @Input() title = '';
  @Input() channel_name = '';
  @Input() date_string = '';
  @Input() video_views = 0;
  @Input() thumbnail_url = '';
  @Input() channel_img_url = '';
  @Input() description = '';
  @Input() callback_action: any = undefined;

  posted_date: Date = new Date();
  timeDiffString: string = '';
  viewsString: string = '';

  constructor() {}
  
  ngOnInit(): void {
    this.posted_date = new Date(this.date_string);
    this.timeDiffString = getTimeDiffFromNow(this.posted_date);
    this.viewsString = getFormattedNumber(this.video_views);
  }

  ngAfterViewInit(): void {
    const thumb_container = document.getElementById(`vbx-container-${this.video_id}`);
    const loading_bar = document.getElementById(`red-loading-bar-${this.video_id}`);

    thumb_container?.addEventListener('mouseenter', () => {
      if (loading_bar != null) {
        loading_bar.style.display = 'block';
      }
    })
    thumb_container?.addEventListener('mouseleave', () => {
      if (loading_bar != null) {
        loading_bar.style.display = 'none';
      }
    })
  }


}
```
There are some input properties to the component so it renders with the correct info of a video, the parent page fetches the data and then dinamically renders the videos boxes to the screen. there are some fancy eye candy animations to the thumbnails with a red loading bar. This is the html for the video box using the @Input() decorator properties.
```html
<div id="vbx-container-{{video_id}}" (click)="this.callback_action()" class="videobox-container mb-2">
    <div class="videobox-thumbnail-container">
        <a routerLink="/watch" [queryParams]="{v:video_id}">
            <img class="videobox-thumbnail-img" src="{{thumbnail_url}}" alt="video thumbnail image">
            <div id="red-loading-bar-{{video_id}}" class="red-loading-bar" style="display: none; height: 4px; width: 0%; background-color: red; animation-play-state: running;"></div>
        </a>
    </div>
    <div class="videobox-info-container">
        <div class="videobox-channel-img-container mt-1">
            <a routerLink="/channel/{{channel_id}}">
                <img class="videobox-channel-img" src="{{channel_img_url}}" alt="channel logo image">
            </a>
        </div>
        <div class="videobox-info mt-1">
            <a routerLink="/watch" [queryParams]="{v:video_id}">
                <div style="max-width: 200px;" class="videobox-title">{{title}}</div>
                <div class="videobox-views-date">{{viewsString}} views &bull; {{timeDiffString}}</div>
            </a>
        </div>
    </div>
</div>
```

#### channelbox.component.ts
It is the redered representation of a channel itself, just a structured ui that contain info about a certain channel.
```ts
import { Component, Input, OnInit } from '@angular/core';
import { getFormattedNumber } from 'src/utils/formatter';

@Component({
  selector: 'app-channelbox',
  templateUrl: './channelbox.component.html',
  styleUrls: ['./channelbox.component.scss']
})
export class ChannelboxComponent implements OnInit {
  @Input() channel_img_url: string = '';
  @Input() channel_name: string = '';
  @Input() username: string = '';
  @Input() channel_subs: string = '';
  @Input() channel_description: string = '';
  @Input() channel_url: string = '';
  getFormattedNumber = getFormattedNumber;
  parseInt = parseInt;

  constructor() {}

  ngOnInit(): void {
    // console.log('Channel Box Updated!');
  }

}
```
The input properties are passed by the parent like channel_name channel_img_url, channel_subs, etc..., the parents usually are an entire page that each fecth the needed data needed to build the UI.  Here is the HTML for the channelbox:
```html
<div class="channelbox-container">

    <div class="channelbox-inner-container">
        <div class="channelbox-img-container">
            <a *ngIf="channel_url" routerLink="{{channel_url}}">
                <app-profilephoto *ngIf="channel_img_url" [size]="130" src="{{channel_img_url}}"></app-profilephoto>
            </a>
        </div>
        <div class="channelbox-info-conatainer">
            <div class="channelbox-title" *ngIf="channel_name"><strong>{{channel_name}}</strong></div>
            <div class="channelbox-username-subs">&#64;{{username}} &bull; {{getFormattedNumber(parseInt(channel_subs))}} subscribers</div>
            <div class="channelbox-desc" *ngIf="channel_description">{{channel_description.substring(0,50)}}...</div>
        </div>
    </div>
    <hr>

</div>
```  

#### profilephoto.component.ts
```ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-profilephoto',
  templateUrl: './profilephoto.component.html',
  styleUrls: ['./profilephoto.component.scss']
})
export class ProfilephotoComponent {
  @Input() src: string = '';
  @Input() size: number = 40;
}

```
This is a component for a generic profile picture with size and src input attributes. The html for the profile picture is:
```html
<img src="{{src}}" width="{{size}}" height="{{size}}" style="border-radius: 50%;">
```

#### navbar.component.ts
This navbar component was my first component to test so ignore the testing logs and it is a static component for the website navbar. Here is the Typescript and JavaScript
```ts
import { leadingComment } from '@angular/compiler';
import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnChanges {
  @Input() parentBindData: string = "";

  constructor() {
    console.log('contructor ran in navbar');
  }

  ngOnInit(): void {
      console.log('Ran ngOnInit in navbar');
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(`ran ngOnChanges in navbar component`);
}
}
```
HTML Template (ignore the giant svg logo):
```html
<nav class="navbar navbar-expand-lg bg-body-tertiary sticky-top">
    <div class="container-fluid">
      <a class="navbar-brand" routerLink="/" style="display: flex; align-items: center; justify-content: center;">
        <div>
          <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
          width="50px" height="50px" viewBox="0 0 256 256" enable-background="new 0 0 256 256" xml:space="preserve">
          <path fill="#FF3939" opacity="1.000000" stroke="none" width="max-content"
            d="
          M89.718033,184.333313 
            C72.943771,180.466583 60.005913,172.629059 54.884048,155.437790 
            C54.381569,153.751251 54.047569,151.945007 54.038120,150.192169 
            C53.968109,137.205841 54.408054,124.203033 53.900997,111.236176 
            C53.204185,93.416695 66.264755,82.436661 78.162155,77.026970 
            C87.477509,72.791313 97.272057,71.763657 107.409309,71.928772 
            C123.721596,72.194481 140.042236,71.894753 156.357742,72.029579 
            C173.084000,72.167793 187.565781,77.972458 197.622360,91.558403 
            C201.177383,96.361069 203.250992,103.118874 203.724091,109.162300 
            C204.656784,121.076988 203.762665,133.122009 204.057739,145.102463 
            C204.436401,160.477219 196.663849,170.849701 184.189484,178.274017 
            C175.024475,183.728683 164.884247,186.035355 154.205185,186.009598 
            C138.388153,185.971436 122.569542,186.121109 106.754631,185.934067 
            C101.190094,185.868256 95.634499,185.046661 89.718033,184.333313 
          M103.993607,116.777817 
            C103.993607,126.124626 103.993607,135.471436 103.993607,145.541824 
            C113.868340,140.040375 123.614082,134.610779 134.192261,128.717422 
            C123.675903,122.401833 114.150589,116.681412 103.993660,110.581673 
            C103.993660,112.943283 103.993660,114.402534 103.993607,116.777817 
          M156.168442,137.426544 
            C156.168442,129.032089 156.168442,120.637627 156.168442,112.310516 
            C153.413040,112.310516 151.353409,112.310516 149.417572,112.310516 
            C149.417572,123.631920 149.417572,134.632416 149.417572,145.512451 
            C151.780975,145.512451 153.709167,145.512451 156.168442,145.512451 
            C156.168442,142.958847 156.168442,140.678848 156.168442,137.426544 
          M137.993591,124.513550 
            C137.993591,131.252701 137.993591,137.991837 137.993591,144.676636 
            C140.636307,144.676636 142.682907,144.676636 144.710968,144.676636 
            C144.710968,133.656357 144.710968,122.967346 144.710968,112.323669 
            C142.363190,112.323669 140.316574,112.323669 137.993591,112.323669 
            C137.993591,116.273674 137.993591,119.897377 137.993591,124.513550 
          z"/>
          <path fill="#FFFCFC" opacity="1.000000" stroke="none" 
            d="
          M103.993637,116.319801 
            C103.993660,114.402534 103.993660,112.943283 103.993660,110.581673 
            C114.150589,116.681412 123.675903,122.401833 134.192261,128.717422 
            C123.614082,134.610779 113.868340,140.040375 103.993607,145.541824 
            C103.993607,135.471436 103.993607,126.124626 103.993637,116.319801 
          z"/>
          <path fill="#FFFCFC" opacity="1.000000" stroke="none" 
            d="
          M156.168442,137.912704 
            C156.168442,140.678848 156.168442,142.958847 156.168442,145.512451 
            C153.709167,145.512451 151.780975,145.512451 149.417572,145.512451 
            C149.417572,134.632416 149.417572,123.631920 149.417572,112.310516 
            C151.353409,112.310516 153.413040,112.310516 156.168442,112.310516 
            C156.168442,120.637627 156.168442,129.032089 156.168442,137.912704 
          z"/>
          <path fill="#FFFCFC" opacity="1.000000" stroke="none" 
            d="
          M137.993591,124.017311 
            C137.993591,119.897377 137.993591,116.273674 137.993591,112.323669 
            C140.316574,112.323669 142.363190,112.323669 144.710968,112.323669 
            C144.710968,122.967346 144.710968,133.656357 144.710968,144.676636 
            C142.682907,144.676636 140.636307,144.676636 137.993591,144.676636 
            C137.993591,137.991837 137.993591,131.252701 137.993591,124.017311 
          z"/>
        </svg>
        </div>
        <div>Videotube</div>
      </a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <a class="nav-link active" aria-current="page" routerLink="/">
              <i class="bi bi-house-fill"></i>
              Home
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" routerLink="channel">
              <i class="bi bi-person-circle"></i>
              Channels
            </a>
          </li>

        </ul>

      </div>
    </div>
  </nav>

```

#### channellistpage.component.ts
It is a page that renders a list of all channels (channelbox components), this is the component that actually fetch the data for the channels.
```ts
import { Component, OnInit } from '@angular/core';
import { getFormattedNumber } from 'src/utils/formatter';
import { Router } from '@angular/router';

@Component({
  selector: 'app-channellistpage',
  templateUrl: './channellistpage.component.html',
  styleUrls: ['./channellistpage.component.scss']
})
export class ChannellistpageComponent implements OnInit {

  channels: any = undefined;

  getChannels() {

    fetch('http://localhost:8000/all_channels', {
      method: 'GET',
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(response => response.json())
    .then(response => {
      this.channels = response.all_channels;
      console.log(this.channels);
    })
  }

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.getChannels();
    
  }

}

```
HTML Template:
```html
<div class="container">

    <app-channelbox
        *ngFor="let channel of channels; let i = index"
        [channel_name]="channel.name"
        [channel_img_url]="channel.logo_url"
        [channel_description]="channel.description"
        [channel_url]="'/channel/'+channel.id"
        [channel_subs]="channel.subscribers_count"
        [username]="channel.owner_username">
    </app-channelbox>

    <div class="d-flex align-items-center justify-content-center" *ngIf="!channels">
        No Chennels Here Yet.
    </div>

</div>
```

#### channelpage.component.ts
This component represents a specific channel page, with all it's videos and info like name, description, etc...
```ts
import { Component, Input, OnInit, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { getFormattedNumber, getTimeDiffFromNow } from 'src/utils/formatter';

@Component({
  selector: 'app-channelpage',
  templateUrl: './channelpage.component.html',
  styleUrls: ['./channelpage.component.scss']
})
export class ChannelpageComponent implements OnInit {

  private activatedRoute = inject(ActivatedRoute);
  private channel_id: number | undefined = undefined;
  channel: any = undefined; 
  subscribers_str: string | undefined = undefined;
  joined_date_str: string | undefined = undefined;
  

  videos: any = undefined;

  fetchChannel() {
    fetch('http://localhost:8000/channel/'+this.channel_id)
    .then(response => response.json())
    .then(res => {
      this.channel = JSON.parse(res.channel);
      console.log(this.channel);
      this.subscribers_str = getFormattedNumber(this.channel.subscribers_count);
      this.joined_date_str = getTimeDiffFromNow(new Date(this.channel.created_at));
    })
  }

  fetchChannelVideos() {
    fetch('http://localhost:8000/videos_by_channel_id/'+this.channel_id)
    .then(response => response.json())
    .then(response => {
      this.videos = response.videos;
      console.log(response.videos);
        
    })
  }

  ngOnInit(): void {
    this.channel_id = this.activatedRoute.snapshot.params['id']
    this.fetchChannel();
    if (this.channel_id !== undefined) {
      this.fetchChannelVideos();
    }
  }

}

```
HTML Template:
```html

<main>

    <div class="container">

        <div class="channel-header pt-3" *ngIf="channel">
            <div class="channel-img-container">
                <img class="channel-img" src="{{channel.logo_url}}" alt="">
            </div>
            <div class="channel-info">
                <div class="channel-name">
                    {{channel.name}}
                </div>
                <div>&commat;{{channel.owner_username}}</div>
                <div class="channel-description">
                    <strong>ABOUT:</strong>
                    <div>{{channel.description.substring(0,150)}}...</div>
                </div>
                <div>
                    Joined &bull; {{joined_date_str}}
                </div>
                <div>
                    <strong>{{subscribers_str}}</strong> subscribers
                </div>
            </div>
        </div>

        <hr>

        <div class="channel-videos">
            <div class="row">
                <app-videobox class="mt-3 col-lg-3 col-md-4 col-sm-12"
                    *ngFor="let video of videos; let i = index"
                    [video_id]="video.id"
                    [channel_id]="video.channel_id"
                    [title]="video.name"
                    [channel_name]="video.channel_name"
                    [channel_img_url]="video.channel_logo_url"
                    [thumbnail_url]="video.thumbnail_url"
                    [date_string]="video.created_at"
                    [video_views]="video.views">
                </app-videobox>
            </div>
        </div>

    </div>

</main>

```

#### homepage.component.ts
```ts
import { Component, OnDestroy, OnInit } from '@angular/core'

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit, OnDestroy {

  videos: any = undefined;

  constructor() {}

  fetch_all_videos() {
    fetch('http://localhost:8000/all_videos', {
      method: 'GET'
    })
    .then(response => response.json())
    .then(response => {
      this.videos = response.all_videos;
    })
  }

  ngOnInit(): void {
    this.fetch_all_videos();
  }

  ngOnDestroy(): void {
    console.log('Cleaning stuff...');
  }
}

```
This is a simple component that fetches all videos saved in the backend.
HTML Template:
```html


<main>

    <div class="container">
        
        <div class="row">

            <app-videobox class="mt-3 col-lg-3 col-md-4 col-sm-12"
                *ngFor="let video of videos; let i = index"
                [video_id]="video.id"
                [channel_id]="video.channel_id"
                [title]="video.name"
                [channel_name]="video.channel_name"
                [channel_img_url]="video.channel_logo_url"
                [thumbnail_url]="video.thumbnail_url"
                [date_string]="video.created_at"
                [video_views]="video.views">
            </app-videobox>

            <div *ngIf="!videos" class="d-flex align-items-center justify-content-center" style="margin-top: 50px;">
                No Videos Here Yet.
            </div>

        </div>
        
    </div>

</main>

```

#### notfound.component.ts
This is a static component that displats a 404 not found message 
```ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-notfound',
  templateUrl: './notfound.component.html',
  styleUrls: ['./notfound.component.scss']
})
export class NotfoundComponent {

}

```
HTML Template:
```html
<div class="container">

    <div class="not-found">
        <i class="bi bi-question-circle-fill" style="font-size: 60px; color: red;"></i>
        <h1><span style="color: red;">4</span>0<span style="color: red;">4</span> Not Found</h1>
    </div>

</div>
```
 
### Backend
In the backend there are some simple routes that delivers the content for the channels and their videos and also a video_stream route for the streaming of the byte chunck, here are the routes:
* '' (index route delivers the built frontend application)
* 'all_videos'
* 'video_metadata/<int:id>'
* 'videos_by_channel_id/<int:channel_id>'
* 'video_stream/<int:id>'
* 'all_channels'
* 'channel/<int:id>'

#### all_videos route
It is a simple route that query all videos in the database using Django ORM and then build and sends a json.
```py
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
```

#### video_metadata route
This route queries data for a single video metadata (as the function name suggests).
```py
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
```

#### videos_by_channel_id route
Query all videos from a certain channel bases on its ID and returns a list of video metadata formatted as json objects. 
```py
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
```

#### channel route
Gets a channel data based on it's id and returns a json object.
```py
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
```

#### all_channels route
This route get all the channels stored in the database and send them as a json object.
```py
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
```

#### video_stream route
This streamming route is quite simple it gets the video file path by the video id sent in the request, first it parses the header for the content range heeader and if it finds it it is a partial content reuqest and then get the video with the determined id, sets the chunck size and set proper start and end bytes setting  the respoinse headers so that the browser player parses it and knows where  in the video you are, open the video reading it's bytes and send it as a file response provided by the django framework that set the body and headers automatically. 
```py
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
```

# The END :)