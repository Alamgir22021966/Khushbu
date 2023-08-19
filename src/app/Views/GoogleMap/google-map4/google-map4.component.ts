import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-google-map4',
  templateUrl: './google-map4.component.html',
  styleUrls: ['./google-map4.component.scss']
})
export class GoogleMap4Component implements OnInit {
  title = 'My first AGM project';
  constructor() { }

  ngOnInit(): void {
  }

  lat = 51.678418;
  lng = 7.809007;

  icon = {
    url: 'https://www.pngfind.com/pngs/m/671-6710560_blue-map-marker-png-transparent-png.png',
    scaledSize: {width: 30, height:40}
  };
  
  
  lat1: number = 51.673858;
	lng1: number = 7.415982;
  zoom = 10;

  mapClick(event:any){
    // console.log(event);
  }

  mapDoubleClick(event:any){
    console.log(event);
  }

  

}

// https://angular-maps.com/guides/getting-started/   ---using the link for creating map