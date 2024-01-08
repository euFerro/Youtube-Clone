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

### Backend
