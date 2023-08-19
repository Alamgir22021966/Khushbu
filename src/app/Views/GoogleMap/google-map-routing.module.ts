import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GooglMapComponent } from './googl-map/googl-map.component';
import { GoogleMap3Component } from './google-map3/google-map3.component';
import { GoogleMap2Component } from './google-map2/google-map2.component';
import { GoogleMap4Component } from './google-map4/google-map4.component'

const routes: Routes = [
  {
    path: '', data: { title: 'Google Map Component' },
    children: [
      {
        path: '', redirectTo: 'GoogleMap', pathMatch: 'full'
      },
      {
        path: 'GoogleMap', component: GooglMapComponent,
        data: { title: 'Google Map Component' }
      },
      {
        path: 'GoogleMap2', component: GoogleMap2Component,
        data: { title: 'Google Map 2 Component' }
      },
      {
        path: 'GoogleMap3', component: GoogleMap3Component,
        data: { title: 'Google Map 3 Component' }
      },
      {
        path: 'GoogleMap4', component: GoogleMap4Component,
        data: { title: 'Google Map 4 Component' }
      },
      

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GoogleMapRoutingModule { }

export const routingComponents = [
  GooglMapComponent,
  GoogleMap2Component,
  GoogleMap3Component,
  GoogleMap4Component,
];