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

###### videobox.component.ts
It is a representaion of the video thumbnail and other info like views and title:
```
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

### Backend
