import { Component } from '@angular/core';
import { TourCard } from '../../tour-authoring/model/tour-card.model';
import { TourAuthoringService } from '../tour-authoring.service';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { TourSearchParams } from '../model/tour-search.model';

@Component({
  selector: 'xp-tours-page',
  templateUrl: './tours-page.component.html',
  styleUrls: ['./tours-page.component.css']
})
export class ToursPageComponent {
  tours: TourCard[] = [];
  currentPage = 1;
  showSearch: boolean = false;
  startLatitude: number = 0;
  endLatitude: number = 0;
  startLongitude: number = 0;
  endLongitude: number = 0;
  searchRadius: number = 0;
  radiusInput: number = 0;
  centerLatitude = new BehaviorSubject<number | null>(null);
  centerLongitude = new BehaviorSubject<number | null>(null);
  radius = new BehaviorSubject<number>(0);
  isFeatureEnabled: boolean = false; 
  touristId: number;
  searchName: string= '';
  searchLength: number = 0;

  constructor(private tourService: TourAuthoringService, private router: Router, private authService: AuthService){
    this.touristId = this.authService.user$.value.id; 
    this.loadTours();
  }

  loadTours(): void {
    this.tourService.getPublishedTourCards(this.currentPage, 8).subscribe({
      next: (result: TourCard[]) => {
        this.tours = result;
        console.log(this.tours);
      },
      error: () => {}
    });
  }

  changeSearch(): void{
    if(this.showSearch){
      this.loadTours()
      this.centerLatitude.next(null);
      this.centerLongitude.next(null);
      this.radius.next(0);
    }

    this.showSearch = !this.showSearch
  }

  nextPage(): void {
    this.currentPage++;
    if(!this.showSearch)
      this.loadTours();
    else
      this.searchTours();
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;

      if(!this.showSearch)
        this.loadTours();
      else
        this.searchTours();
    }
  }

   
  changeLongLat(latLong: number[]): void {
      const [lat, long] = latLong;
      this.centerLatitude.next(lat);
      this.centerLongitude.next(long);
      console.log("Coordinates set to:", lat, long); 
  }

onRadiusChange(): void {
  this.radius.next(this.radiusInput); 
  console.log("Radius set to:", this.radius.getValue()); 
}


  
searchTours(): void {
  const centerLat = this.centerLatitude.getValue();
  const centerLong = this.centerLongitude.getValue();
  const radiusKm = this.radius.getValue();
  const searchName = this.searchName?.trim();

  // Initialize with only required parameters
  const tourSearchParams: TourSearchParams = {
    page: this.currentPage,
    pageSize: 8
  };

  // Only add location parameters if ALL location-related values are present and valid
  if (centerLat !== null && centerLong !== null && radiusKm > 0) {
    const calculatedBoundaries = this.calculateSearchBoundaries(
      centerLat,
      centerLong,
      radiusKm
    );

    // Only add coordinates if they're valid
    if (calculatedBoundaries && 
        this.isValidCoordinate(calculatedBoundaries.startLat, calculatedBoundaries.startLong) &&
        this.isValidCoordinate(calculatedBoundaries.endLat, calculatedBoundaries.endLong)) {
      tourSearchParams.startLat = calculatedBoundaries.startLat;
      tourSearchParams.endLat = calculatedBoundaries.endLat;
      tourSearchParams.startLong = calculatedBoundaries.startLong;
      tourSearchParams.endLong = calculatedBoundaries.endLong;
    }
  }

  // Add name filter if provided and not empty
  if (searchName && searchName.length > 0) {
    tourSearchParams.name = searchName;
  }

  // Add length filter if provided and valid
  if (this.searchLength > 0) {
    tourSearchParams.length = this.searchLength;
  }

  console.log("Search parameters:", tourSearchParams);

  this.tourService.getPublishedTourCardsFiltered(tourSearchParams).subscribe({
    next: (result) => {
      this.tours = result;
      console.log("Filtered tours:", this.tours);
      if (this.tours.length === 0) {
        console.log("No tours found with the specified criteria.");
      }
    },
    error: (error) => {
      console.error("Error fetching filtered tours:", {
        status: error.status,
        message: error.error,
        params: tourSearchParams,
      });
    },
  });
}

private isValidCoordinate(lat: number, long: number): boolean {
  return lat >= -90 && lat <= 90 && long >= -180 && long <= 180;
}

private calculateSearchBoundaries(centerLat: number, centerLong: number, radiusKm: number) {
  const deltaLat = radiusKm / 111; // Approx. 111 km per degree latitude
  const startLat = Math.max(-90, centerLat - deltaLat);
  const endLat = Math.min(90, centerLat + deltaLat);

  const deltaLong = radiusKm / (111 * Math.cos((centerLat * Math.PI) / 180));
  const startLong = Math.max(-180, centerLong - deltaLong);
  const endLong = Math.min(180, centerLong + deltaLong);

  return { startLat, endLat, startLong, endLong };
}

detailedTour(tour: TourCard): void {
  if (!tour || !tour.id) {
      console.error('Invalid tour data');
      return;
  }
  this.router.navigate(['/tour-detailed-view', tour.id]);
}

onFeatureToggle(event: any): void {
  this.isFeatureEnabled = event.checked; // Dobijanje stanja checkboxa

  if (this.isFeatureEnabled) {
    this.getToursByActivePreference();
  } else {
    this.loadTours();
  }
}

getToursByActivePreference(): void {
  if (!this.touristId) {
    console.error('Tourist ID is not set.');
    return;
  }

  this.tourService.getToursByActivePreference(this.touristId, this.currentPage, 8).subscribe({
    next: (response: any) => {
      if (response.results && Array.isArray(response.results)) {
        this.tours = response.results; 
        console.log("Tours based on preferences:", this.tours);
      } else {
        console.error("Unexpected response format:", response);
      }
    },
    error: (err) => {
      console.error('Error fetching preference-based tours:', err);
    },
  });
}
}