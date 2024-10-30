import { Component, AfterViewInit, SimpleChanges } from '@angular/core';
import { MapService } from './map.service';
import { Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { Facility } from '../model/facility';
import * as L from 'leaflet';
import { UserLocationService } from '../user-location/user-location.service';

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

  //@Input() isFacility: boolean; //false ako je u pitanju 'keyPoint', true ako je 'object' (flag za dodavanje)
  @Input() facilities: Facility[];
  @Input() isViewOnly: boolean = false;
  //@Input() keypoints
  @Input() markerAddMode: string = 'keypoint';
  @Input() simulatorEnabled: boolean = false;

  @Output() addItem = new EventEmitter<number[]>();
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

    this.addItem.emit([lat, lng])
  }

  setUserLocationMarker(latlng: [number, number], popupText: string = 'User Location') {
    if (this.userLocationMarker)
      this.map.removeLayer(this.userLocationMarker);

    const marker = new L.Marker(latlng, { title: popupText }).bindPopup(popupText);
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

  setRoute(markPoints: L.Marker[]): void {
    if (this.routeControl) {
      this.routeControl.remove();
    }

    const wPoints = markPoints.map(marker => marker.getLatLng());

    this.routeControl = L.Routing.control({
      waypoints: wPoints, //L.latLng(57.74, 11.94), L.latLng(57.6792, 11.949)
      //ovaj 'pk' je token sa mapbox sajta za koji sam nalog napravio preko uns maila, ako ne radi vama probajte napraviti nalog ima link u 2.4 lekciji
      router: L.routing.mapbox('pk.eyJ1IjoiaGFrdGFrIiwiYSI6ImNtMmk0MnZ5NDAwOWcybHNnN2N4dHRubnAifQ.kOERM4mimLJzQay3IqWDpw', { profile: 'mapbox/walking' })
    }).addTo(this.map);

    this.routeControl.on('routesfound', function (e: { routes: any; }) {
      var routes = e.routes;
      var summary = routes[0].summary;
    });
  }

  loadMarkers(): void {
    if (!this.map)
      return;
    if (this.facilities && this.facilities.length !== 0)
      this.loadFacilities();
  }

  loadFacilities(): void {
    this.facilities.forEach(facility => {
      const marker = new L.Marker([facility.latitude, facility.longitude], { title: 'facility' }).addTo(this.map).bindPopup('Ja sam object');
      this.markers.push(marker);
    });
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
    if (lastMarker)
      this.map.removeLayer(lastMarker)
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
  }

}
