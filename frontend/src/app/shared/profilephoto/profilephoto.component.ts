import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-profilephoto',
  templateUrl: './profilephoto.component.html',
  styleUrls: ['./profilephoto.component.scss']
})
export class ProfilephotoComponent {
  @Input() src: string = '';
  @Input() size: number = 40;
}
