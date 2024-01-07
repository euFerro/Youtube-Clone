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
