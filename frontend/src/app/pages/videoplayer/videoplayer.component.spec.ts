import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoplayerComponent } from './videoplayer.component';

describe('VideoplayerComponent', () => {
  let component: VideoplayerComponent;
  let fixture: ComponentFixture<VideoplayerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VideoplayerComponent]
    });
    fixture = TestBed.createComponent(VideoplayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
