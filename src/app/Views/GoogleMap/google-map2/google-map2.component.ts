import { Component, OnInit } from '@angular/core';
import { MouseEvent } from '@agm/core';

@Component({
  selector: 'app-googlemap2',
  templateUrl: './google-map2.component.html',
  styleUrls: ['./google-map2.component.scss']
})
export class GoogleMap2Component implements OnInit {

  zoom: number = 8;

  // initial center position for the map
  lat: number = 51.673858;
  lng: number = 7.815982;

  constructor() {
    this.start_end_mark.push(this.latlng[0]);
    this.start_end_mark.push(this.latlng[this.latlng.length - 1]);
   }

  ngOnInit(): void {
  }

  mapClicked($event: MouseEvent) {
		this.markers.push({
			lat: $event.coords.lat,
			lng: $event.coords.lng,
			draggable: true
		});
	}

  markers: marker[] = [
    {
      lat: 51.673858,
      lng: 7.815982,
      label: 'A',
      draggable: false
    },
    {
      lat: 51.373858,
      lng: 7.8151,
      label: 'B',
      draggable: false
    },
    {
      lat: 51.723858,
      lng: 7.895982,
      label: 'C',
      draggable: false
    }
  ]

  geoJson = {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "Polygon",
          "coordinates": [
            [
              [
                7.8682708740234375,
                51.39192241721654
              ],
              [
                7.9987335205078125,
                51.46213587023546
              ],
              [
                7.941741943359374,
                51.54718906424884
              ],
              [
                7.911529541015624,
                51.66659318427356
              ],
              [
                7.806472778320312,
                51.72447619956401
              ],
              [
                7.682876586914063,
                51.69639515869895
              ],
              [
                7.551040649414062,
                51.62014819421578
              ],
              [
                7.3450469970703125,
                51.541637671663594
              ],
              [
                7.3773193359375,
                51.47796179607121
              ],
              [
                7.544174194335937,
                51.431323737268755
              ],
              [
                7.566833496093749,
                51.325033860456315
              ],
              [
                7.75909423828125,
                51.28167570765906
              ],
              [
                7.8421783447265625,
                51.31816797246441
              ],
              [
                7.8682708740234375,
                51.39192241721654
              ]
            ]
          ]
        }
      }
    ]
  }

  log(str: string) {
    console.log(str)
  }



  start_end_mark = [];

  latlng = [
    [
      23.0285312,
      72.5262336
    ],
    [
      19.0760,
      72.8777
    ],
    [
      25.2048,
      55.2708
    ]
  ];

}

interface marker {
	lat: number;
	lng: number;
	label?: string;
	draggable: boolean;
}


// https://stackblitz.com/edit/angular-google-maps-agm-complete-guide?file=src%2Fapp%2Fapp.component.ts