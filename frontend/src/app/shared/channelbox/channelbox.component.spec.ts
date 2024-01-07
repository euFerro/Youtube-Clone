import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelboxComponent } from './channelbox.component';

describe('ChannelboxComponent', () => {
  let component: ChannelboxComponent;
  let fixture: ComponentFixture<ChannelboxComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChannelboxComponent]
    });
    fixture = TestBed.createComponent(ChannelboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
