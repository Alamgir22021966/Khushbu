import { Component, OnInit } from '@angular/core';
import { MouseEvent } from '@agm/core';

@Component({
	selector: 'app-googl-map',
	templateUrl: './googl-map.component.html',
	styleUrls: ['./googl-map.component.scss']
})
export class GooglMapComponent implements OnInit {


	constructor() { }

	ngOnInit(): void {
	}

	zoom: number = 8;

	// initial center position for the map
	lat: number = 51.673858;
	lng: number = 7.815982;


	clickedMarker(label: string, index: number) {
		console.log(`clicked the marker: ${label || index}`)
	}

	public customStyle = [{
		"featureType": "poi.medical",
		"elementType": "all",
		"stylers": [{
			visibility: "off",
		}]
	},];

	mapClicked(event: MouseEvent) {
		this.markers.push({
			lat: event.coords.lat,
			lng: event.coords.lng,
			draggable: true
		});
	}

	markerDragEnd(m: marker, $event: MouseEvent) {
		console.log('dragEnd', m, $event);
	}
	

	markers: marker[] = [
		{
			lat: 51.673858,
			lng: 7.815982,
			label: 'A',
			draggable: true
		},
		{
			lat: 51.373858,
			lng: 7.215982,
			label: 'B',
			draggable: false
		},
		{
			lat: 51.403858,
			lng: 7.315982,
			label: 'D',
			draggable: false
		},
		{
			lat: 51.723858,
			lng: 7.895982,
			label: 'C',
			draggable: true
		}
	]

}

interface marker {
	lat: number;
	lng: number;
	label?: string;
	draggable: boolean;
}

// https://www.itsolutionstuff.com/post/angular-google-maps-using-agm-core-exampleexample.html

// https://www.freakyjolly.com/angular-google-maps-using-agm-core/     --Important

// https://angular-maps.com/guides/getting-started/   ---using the link for creating map