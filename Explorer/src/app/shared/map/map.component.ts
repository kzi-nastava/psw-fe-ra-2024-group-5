import { Component, AfterViewInit, SimpleChanges } from '@angular/core';
import { MapService } from './map.service';
import { Input } from '@angular/core';
import * as L from 'leaflet';
import { Facility } from '../model/facility';
import { OnChanges, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements AfterViewInit {
  private map: any; 
  private markers: L.Marker[] = [];
  private routeControl: any;
  @Input() isFacility: boolean; //false ako je u pitanju 'keyPoint', true ako je 'object' (flag za dodavanje)
  @Input() facilities: Facility[];
  //@Input() keypoints
  @Output() addItem = new EventEmitter<number[]>();

  constructor(private mapService: MapService) {}

  private initMap(): void {
    this.map = L.map('map', {
      center: [45.2396, 19.8227],
      zoom: 13,
    });
    this.loadMarkers()
    this.registerOnClick(); 
    // this.search()
    // this.setRoute(L.latLng(57.74, 11.94), L.latLng(57.6792, 11.949))
    
    const tiles = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 18,
        minZoom: 3,
        attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }
    );
    tiles.addTo(this.map);
  }

  ngAfterViewInit(): void {
    let DefaultIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.6.0/dist/images/marker-icon.png',
    });

    L.Marker.prototype.options.icon = DefaultIcon;

    this.initMap();
    //ovaj search cemo pozivati kada dodamo neki textbox za search ili tako nesto
    // this.search();
  }

  search(searchInput: string): void {
    this.mapService.search('Strazilovska 19, Novi Sad').subscribe({  //searchInput umesto ovoga
      next: (result) => {
        if(this.isFacility){
          this.addObjectMarker([result[0].lat, result[0].lon], 'Pozdrav iz Strazilovske 19.');
        }else{
          this.addKeyPointMarker([result[0].lat, result[0].lon], 'Pozdrav iz Strazilovske 19.');
        }
        // L.marker([result[0].lat, result[0].lon])
        //   .addTo(this.map)
        //   .bindPopup('Pozdrav iz Strazilovske 19.')
        //   .openPopup();
      },
      error: () => {},
    });
  }

  registerOnClick(): void {
    this.map.on('click', (e: any) => {
      const coord = e.latlng;
      const lat = coord.lat;
      const lng = coord.lng;
      this.mapService.reverseSearch(lat, lng).subscribe((res) => {
        //console.log(res.display_name);
        // RES se koristi da prikaze ulicu grad.. od mesta koje je selektovano
      });
      if(this.isFacility){
        this.addObjectMarker([lat, lng], 'New Marker')
      }else{
        this.addKeyPointMarker([lat, lng], 'New Marker');
      }

      this.addItem.emit([lat,lng])
    });
  }

  addObjectMarker(latlng: [number, number], popupText: string): void {
    const marker = new L.Marker(latlng, {title: 'facility'}).addTo(this.map).bindPopup(popupText);
    this.markers.push(marker);
  }

  addKeyPointMarker(latlng: [number, number], popupText: string): void {
    const marker = new L.Marker(latlng).addTo(this.map).bindPopup(popupText);
    this.markers.push(marker);
    // Check if we have two markers
    if (this.markers.length >= 2) {
      this.setRoute(this.markers);
    }
  }
  
  setRouteToObject(myLocation: [number, number]){ //ovo ce biti ruta od turiste do objekta
    
    const marker = new L.Marker(myLocation).addTo(this.map).bindPopup("Moja lokacija");
    this.markers.unshift(marker);
    this.setRoute(this.markers)
  }

  setRoute(markPoints:  L.Marker[]): void {
    if (this.routeControl) {
      this.routeControl.remove();
    }
    
    const wPoints = markPoints.map(marker => marker.getLatLng());

    this.routeControl = L.Routing.control({
      waypoints: wPoints, //L.latLng(57.74, 11.94), L.latLng(57.6792, 11.949)
      //ovaj 'pk' je token sa mapbox sajta za koji sam nalog napravio preko uns maila, ako ne radi vama probajte napraviti nalog ima link u 2.4 lekciji
      router: L.routing.mapbox('pk.eyJ1IjoiaGFrdGFrIiwiYSI6ImNtMmk0MnZ5NDAwOWcybHNnN2N4dHRubnAifQ.kOERM4mimLJzQay3IqWDpw', {profile: 'mapbox/walking'}) 
    }).addTo(this.map);

    this.routeControl.on('routesfound', function(e: { routes: any; }) {
      var routes = e.routes;
      var summary = routes[0].summary;
    });
  }

    loadMarkers(): void{
      console.log(this.facilities)
      console.log(this.isFacility)
      if(this.facilities && this.facilities.length !== 0)
        this.loadFacilities();
    }

    loadFacilities(): void{
      this.facilities.forEach(facility => {
       this.addObjectMarker([facility.latitude, facility.longitude], 'Ja sam object')
      });
    }

    getMarkers() : L.Marker[]{
      return this.markers;
    }

    getRouteControl(): any {
      return this.routeControl; // Return the current routeControl instance
    }
  
    removeMarkers(): void{ 
      this.markers.forEach(marker => {
        this.map.removeLayer(marker);
      });
      this.markers = []; // Clear markers from array
    }

    removeLastMarker(): void{ //ovo se poziva kada hocete da promenite lokaciju markera, ili izbrisete poslednji
      const m = this.markers.pop()
      this.map.removeLayer(m)
    }

  removeRoute(): void {
    if (this.routeControl) {
      this.routeControl.remove();
      this.routeControl = null; // Clear the reference
    }
  }

  ngOnChanges(changes: SimpleChanges): void{
    if (changes['facilities'] && changes['facilities'].currentValue) {
      this.loadMarkers();
    }
  }

}
