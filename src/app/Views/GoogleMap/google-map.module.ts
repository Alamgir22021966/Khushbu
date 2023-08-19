import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleMapRoutingModule, routingComponents } from './google-map-routing.module';
import { AgmCoreModule } from '@agm/core';
import { AgmOverlays } from "agm-overlays";



@NgModule({
  declarations: [
    routingComponents,
    
  ],
  imports: [
    CommonModule,
    GoogleMapRoutingModule,
    AgmOverlays,
    AgmCoreModule.forRoot({  

      apiKey: 'AIzaSyAF-o3CiFqjvA2gC5nfBBvYH7YoKYG4zME',
      libraries: ['places', 'drawing', 'geometry'], 
  })
  
  ]
})
export class GoogleMapModule { }


// https://developers.google.com/maps/documentation/javascript/get-api-key?hl=en