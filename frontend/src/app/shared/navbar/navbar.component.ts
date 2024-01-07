import { leadingComment } from '@angular/compiler';
import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnChanges {
  @Input() parentBindData: string = "";

  constructor() {
    console.log('contructor ran in navbar');
  }

  ngOnInit(): void {
      console.log('Ran ngOnInit in navbar');
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(`ran ngOnChanges in navbar component`);
}
}
