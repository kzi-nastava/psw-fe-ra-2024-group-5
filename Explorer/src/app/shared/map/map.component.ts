import { Component, AfterViewInit } from '@angular/core';
import { MapService } from './map.service';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements AfterViewInit {
  private map: any; 
  private markers: L.Marker[] = [];
  private routeControl: any;
  private isLastMarkerSet: boolean;

  constructor(private mapService: MapService) {}

  private initMap(): void {
    this.map = L.map('map', {
      center: [45.2396, 19.8227],
      zoom: 13,
    });
    this.isLastMarkerSet = true;
    // this.loadMarkers([L.latLng(57.74, 11.94), L.latLng(57.6792, 11.949), L.latLng(45.2396, 19.8227)])
    this.registerOnClick(true); //false ako je u pitanju 'keyPpoint', true ako je 'object'
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

  search(isObject: boolean, searchInput: string): void {
    this.mapService.search('Strazilovska 19, Novi Sad').subscribe({  //searchInput umesto ovoga
      next: (result) => {
        if(isObject){
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

  registerOnClick(isObject: boolean): void {
    this.map.on('click', (e: any) => {
      const coord = e.latlng;
      const lat = coord.lat;
      const lng = coord.lng;
      this.mapService.reverseSearch(lat, lng).subscribe((res) => {
        //console.log(res.display_name);
        // RES se koristi da prikaze ulicu grad.. od mesta koje je selektovano
      });
      if(isObject){
        this.addObjectMarker([lat, lng], 'New Marker')
      }else{
        this.addKeyPointMarker([lat, lng], 'New Marker');
      }
      // alert(mp.getLatLng());
    });
  }

  addObjectMarker(latlng: [number, number], popupText: string): void {
    if(!this.isLastMarkerSet && this.markers.length !== 0){
      this.removeLastMarker();
    }
    const marker = new L.Marker(latlng).addTo(this.map).bindPopup(popupText);
    this.markers.push(marker);
    this.isLastMarkerSet = false;

        // this.setRouteToObject([45.2396, 19.8227])
    
  }

  addKeyPointMarker(latlng: [number, number], popupText: string): void {

    if(!this.isLastMarkerSet && this.markers.length !== 0){
      this.removeLastMarker();
    }
    const marker = new L.Marker(latlng).addTo(this.map).bindPopup(popupText);
    this.markers.push(marker);
    this.isLastMarkerSet = false;
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
      router: L.routing.mapbox('pk.eyJ1IjoiaGFrdGFrIiwiYSI6ImNtMmk0MnZ5NDAwOWcybHNnN2N4dHRubnAifQ.kOERM4mimLJzQay3IqWDpw', {profile: 'mapbox/walking'}) //ova 'pk' kobasica je token sa mapbox sajta za koji sam nalog napravio preko uns maila, ako ne radi vama probajte napraviti nalog ima link u 2.4 lekciji
    }).addTo(this.map);

    this.routeControl.on('routesfound', function(e: { routes: any; }) {
      var routes = e.routes;
      var summary = routes[0].summary;
      //alert('Total distance is ' + summary.totalDistance / 1000 + ' km and total time is ' + Math.round(summary.totalTime % 3600 / 60) + ' minutes');
    });
  }

    loadMarkers(loadedMarkers: L.LatLng[]): void{
      loadedMarkers.forEach(latlng => {
        const m = new L.Marker(latlng).addTo(this.map).bindPopup("Smarqc");
        this.markers.push(m);
      });
    }

    getMarkers() : L.Marker[]{
      return this.markers;
    }

    confirmMarker(): void{
      this.isLastMarkerSet = true;
    }

    getRouteControl(): any {
      return this.routeControl; // Return the current routeControl instance
    }
  
    removeMarkers(): void{ 
      this.markers.forEach(marker => {
        this.map.removeLayer(marker);
      });
      this.markers = []; // Clear markers from array
      this.isLastMarkerSet = false;
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

}
