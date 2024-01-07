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
