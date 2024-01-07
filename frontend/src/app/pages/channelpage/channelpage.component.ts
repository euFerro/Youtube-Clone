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
