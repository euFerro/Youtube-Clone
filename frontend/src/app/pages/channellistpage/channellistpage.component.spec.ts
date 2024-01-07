import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannellistpageComponent } from './channellistpage.component';

describe('ChannellistpageComponent', () => {
  let component: ChannellistpageComponent;
  let fixture: ComponentFixture<ChannellistpageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChannellistpageComponent]
    });
    fixture = TestBed.createComponent(ChannellistpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
