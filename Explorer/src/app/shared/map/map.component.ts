import { Component, AfterViewInit, SimpleChanges } from '@angular/core';
import { MapService } from './map.service';
import { Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { Facility } from '../model/facility';
import * as L from 'leaflet';
import { UserLocationService } from '../user-location/user-location.service';
import { UserPosition } from '../model/userPosition.model';
import { KeyPoint } from 'src/app/feature-modules/tour-authoring/model/key-point.model';
import { Encounter } from 'src/app/feature-modules/encounter/model/encounter.model';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements AfterViewInit {
  private map: L.Map;
  private markers: L.Marker[] = [];
  private routeControl: any;
  private isLastMarkerSet: boolean;
  private userLocationMarker: L.Marker;

  simulator: boolean = false;

  @Input() facilities: Facility[];
  @Input() isViewOnly: boolean = false;
  @Input() keyPoints: KeyPoint[];
  @Input() markerAddMode: string = 'keypoint';
  @Input() simulatorEnabled: boolean = false;
  @Input() encounters: Encounter[];

  @Output() addFacility = new EventEmitter<number[]>();
  @Output() addKeyPoint = new EventEmitter<number[]>();
  @Output() setaRouteLength = new EventEmitter<number>();
  @Output() userLocationChange = new EventEmitter<[number, number]>();

  constructor(private mapService: MapService, private userLocationService: UserLocationService) { }

  private initMap(): void {
    this.map = L.map('map', {
      center: [45.2396, 19.8227],
      zoom: 13,
    });
    this.isLastMarkerSet = false;
    this.map.on('click', this.registerOnClick.bind(this));
    //this.registerOnClick();
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
    this.loadMarkers();
  }

  ngAfterViewInit(): void {
    let DefaultIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.6.0/dist/images/marker-icon.png',
    });

    L.Marker.prototype.options.icon = DefaultIcon;

    this.initMap();
  }

  search(searchInput: string): void {
    this.mapService.search(searchInput).subscribe({
      next: (result) => {
        this.addMarker([result[0].lat, result[0].lon]);
      },
      error: (err) => { console.error(err) },
    });
  }

  registerOnClick(e: L.LeafletMouseEvent): void {
    const coord = e.latlng;
    const lat = coord.lat;
    const lng = coord.lng;

    this.mapService.reverseSearch(lat, lng).subscribe((res) => {
      //console.log(res.display_name);
      // RES se koristi da prikaze ulicu grad.. od mesta koje je selektovano
    });

    if (this.simulator)
      this.setUserLocationMarker([lat, lng]);
    else if (!this.isViewOnly)
      this.addMarker([lat, lng], 'New Marker');
    
    switch (this.markerAddMode) {
      case 'facility':
        this.addFacility.emit([lat, lng])
        break;
        case 'keypoint':
        this.addKeyPoint.emit([lat, lng])
        break;
      default:
        break;
    }
  }

  setUserLocationMarker(latlng: [number, number], popupText: string = 'User Location') {
    const userIcon = L.icon({
      iconUrl: 'https://maps.google.com/mapfiles/kml/shapes/man.png',
      iconSize: [40, 40],
      iconAnchor: [16, 32],
    });

    if (this.userLocationMarker)
      this.map.removeLayer(this.userLocationMarker);

    const marker = new L.Marker(latlng, { title: popupText, icon: userIcon }).bindPopup(popupText);
    this.userLocationMarker = marker;
    this.userLocationMarker.addTo(this.map);

    this.userLocationService.setCurrentUserPosition(latlng);
    this.userLocationChange.emit(latlng);
  }

  addMarker(latlng: [number, number], popupText?: string): void {
    switch (this.markerAddMode) {
      case 'facility':
        this.addObjectMarker(latlng, popupText ?? 'facility');
        break;
      case 'keypoint':
        this.addKeyPointMarker(latlng, popupText ?? 'keypoint');
        break;
      default:
        break;
    }
  }

  addObjectMarker(latlng: [number, number], popupText: string): void {
    if (!this.isLastMarkerSet && this.markers.length !== 0) {
      this.removeLastMarker();
    }

    const marker = new L.Marker(latlng, { title: 'facility' }).addTo(this.map).bindPopup(popupText);
    this.markers.push(marker);
  }

  addKeyPointMarker(latlng: [number, number], popupText: string): void {
    const marker = new L.Marker(latlng).setZIndexOffset(1000).bindPopup(popupText).addTo(this.map);
    this.markers.push(marker);
    // Check if we have two markers
    if (this.markers.length >= 2) {
      this.setRoute(this.markers);
    }
  }

  confirmMarker(): void {
    this.isLastMarkerSet = true;
  }

  setRouteToObject(myLocation: [number, number]) { //ovo ce biti ruta od turiste do objekta
    const marker = new L.Marker(myLocation).addTo(this.map).bindPopup("Moja lokacija");
    this.markers.unshift(marker);
    this.setRoute(this.markers)
  }

  setRoute(markPoints: L.Marker[]): void{
    if (this.routeControl) {
      this.routeControl.remove();
    }

    const wPoints = markPoints.map(marker => marker.getLatLng());

    this.routeControl = L.Routing.control({
      waypoints: wPoints, //primer: 1. L.latLng(57.74, 11.94) 2. L.latLng(57.6792, 11.949)
      //ovaj 'pk' je token sa mapbox sajta za koji sam nalog napravio preko uns maila, ako ne radi vama probajte napraviti nalog ima link u 2.4 lekciji
      router: L.routing.mapbox('pk.eyJ1IjoiaGFrdGFrIiwiYSI6ImNtMmk0MnZ5NDAwOWcybHNnN2N4dHRubnAifQ.kOERM4mimLJzQay3IqWDpw', { profile: 'mapbox/walking' })
    }).addTo(this.map);

    // Listen for the 'routesfound' event when routes are calculated
  this.routeControl.on('routesfound', (e: any) => {
    const routes = e.routes;  // Accessing the routes array directly
    if (routes.length > 0) {
      const summary = routes[0].summary;  // Get the summary from the first route
      if (summary) {
        // Ensure summary has the expected properties
        const distanceInKm = summary.totalDistance / 1000;  // Convert meters to kilometers
        const timeInMinutes = Math.round(summary.totalTime / 60); // Convert seconds to minutes
        console.log(`Distance: ${distanceInKm} km, Time: ${timeInMinutes} minutes`);
        this.setaRouteLength.emit(distanceInKm) //valjda ovo ne pravi problem ako je u slucaju dodavanja objekata
      } else {
        console.error('No summary available for the route.');
      }
    }
  });
  
}

  loadMarkers(): void {
    if (!this.map)
      return;
    if (this.facilities && this.facilities.length !== 0)
      this.loadFacilities();
    if (this.keyPoints && this.keyPoints.length !== 0)
      this.loadKeyPoints();
    if(this.encounters && this.encounters.length !== 0)
      this.loadEncounters();

    this.loadUserLocation();
  }

  loadFacilities(): void {
    this.facilities.forEach(facility => {
      const facilityIcon = L.icon({
        iconUrl: 'https://maps.google.com/mapfiles/ms/icons/blue-pushpin.png', 
        iconSize: [40, 40], 
        iconAnchor: [16, 32],
      });

      const marker = new L.Marker([facility.latitude, facility.longitude], { title: 'facility', icon: facilityIcon }).addTo(this.map).bindPopup(facility.name);
      this.markers.push(marker);
    });
  }

  loadKeyPoints(): void {
    this.keyPoints.forEach(keypoint => {
      const keypointIcon = L.icon({
        iconUrl: 'https://maps.google.com/mapfiles/kml/paddle/K.png',
        iconSize: [40, 40],
        iconAnchor: [16, 32],
      });

      const marker = new L.Marker([keypoint.latitude, keypoint.longitude], { icon: keypointIcon }).setZIndexOffset(1000).bindPopup('Ja sam keypoint').addTo(this.map);
      this.markers.push(marker);
    });
  }

  loadEncounters(): void {
    this.encounters.forEach(encounter => {
      const encounterIcon = L.icon({
        iconUrl: 'https://maps.google.com/mapfiles/ms/icons/red-pushpin.png', 
        iconSize: [40, 40],
        iconAnchor: [16, 32],
      });

      const statusMap = {
        0: 'Draft',
        1: 'Active',
        2: 'Archived',
      };
      const typeMap = {
        0: 'Misc',
        1: 'Social',
        2: 'Location',
      };

      console.log(encounter.status);
      const popupContent = `
      <div style="padding: 5px;">
        <h3 style="font-weight: bold">${encounter.name}</h3>
        <p>${encounter.description}</p>
        <p>Experience Points: <span class="popup-encounter__xp-value" style="color: var(--text-title);">${encounter.xp}</span></p>
        <p>Status: <span class="popup-encounter__status-value" style="color: var(--text-title);">${statusMap[encounter.status]}</span></p>
        <p>Type: <span class="popup-encounter__type-value" style="color: var(--text-title);">${typeMap[encounter.type]}</span></p>
      </div>
      `;
  
    const marker = new L.Marker([encounter.location.latitude, encounter.location.longitude], { title: 'encounter', icon: encounterIcon })
      .addTo(this.map)
      .bindPopup(popupContent);  
      this.markers.push(marker);
    });
  }

  loadUserLocation(): void {
    const userPosition = this.userLocationService.getUserPosition();
    if (userPosition) {
      this.setUserLocationMarker([userPosition.latitude, userPosition.longitude]);
    }
  }

  getMarkers(): L.Marker[] {
    return this.markers;
  }

  getRouteControl(): any {
    return this.routeControl; // Return the current routeControl instance
  }

  removeMarkers(): void {
    this.markers.forEach(marker => {
      this.map.removeLayer(marker);
    });
    this.markers = []; // Clear markers from array
  }

  removeLastMarker(): void { //ovo se poziva kada hocete da promenite lokaciju markera, ili izbrisete poslednji
    const lastMarker = this.markers.pop()
    if (lastMarker){
      this.map.removeLayer(lastMarker)
      this.setRoute(this.markers)
    }
  }

  removeExactMarker(latlng: number[]){
    const index = this.markers.findIndex(m => m.getLatLng().lat == latlng[0] && m.getLatLng().lng == latlng[1]);
  
    // If the keyPoint exists in the array (index >= 0), remove it
    if (index !== -1) {
      const kp = this.markers[index]
      this.map.removeLayer(kp)
      this.markers.splice(index, 1); // Remove 1 element at the found index
      this.setRoute(this.markers)
    }
  }

  removeRoute(): void {
    if (this.routeControl) {
      this.routeControl.remove();
      this.routeControl = null; // Clear the reference
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['facilities'] && changes['facilities'].currentValue) {
      this.loadMarkers();
    }

    if (changes['encounters'] && changes['encounters'].currentValue) {
      this.loadMarkers();
    }
  }


}

// ako si dosao dovde moje saucesce
//ko prezivi pricace: 11.12.2024.