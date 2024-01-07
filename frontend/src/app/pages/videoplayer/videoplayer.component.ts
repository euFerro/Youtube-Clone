import { Component, OnInit, Input } from '@angular/core';
import { VideoboxComponent } from 'src/app/shared/videobox/videobox.component';
import { getFormattedNumber, getTimeDiffFromNow } from 'src/utils/formatter';
import { ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-videoplayer',
  templateUrl: './videoplayer.component.html',
  styleUrls: ['./videoplayer.component.scss']
})
export class VideoplayerComponent implements OnInit {

  video_id: any = undefined;
  video: any = undefined;
  all_videos: any = undefined;
  recomended_videos: any = undefined; 
  views_str: string | undefined = undefined;
  video_time_str: string | undefined = undefined;
  channel_id: number | undefined = undefined;
  channel_subs_str: string | undefined = undefined;
  subscription: any = undefined;

  constructor(private route: ActivatedRoute) {
    this.subscription = this.route.queryParamMap
      .subscribe((p:any) => {
        this.video_id = p['params'].v;
        console.log('query param changed:' + this.video_id);
      })
  }

  setVideoMetadata() {
    fetch(`http://localhost:8000/video_metadata/${this.video_id}`)
    .then(response => response.json())
    .then(res => {
      console.log(res.video);
      this.video = res.video;
      this.views_str = getFormattedNumber(this.video.views);
      this.video_time_str = getTimeDiffFromNow(new Date(this.video.created_at));
      this.channel_subs_str = getFormattedNumber(this.video.channel_subs);
      this.channel_id = this.video.channel_id;
    });
  }

  fetch_recomendation_videos() {
    fetch('http://localhost:8000/all_videos', {
      method: 'GET'
    })
    .then(response => response.json())
    .then(response => {
      this.all_videos = response.all_videos;
      this.recomended_videos = this.all_videos.filter((video: any) => video.id != this.video_id);
      console.log(this.recomended_videos);
        
    })
  }

  ngOnInit(): void {
    this.setVideoMetadata();
    this.fetch_recomendation_videos();
  }

}
