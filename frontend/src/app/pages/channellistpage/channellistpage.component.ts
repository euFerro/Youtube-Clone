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
