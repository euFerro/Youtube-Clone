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
