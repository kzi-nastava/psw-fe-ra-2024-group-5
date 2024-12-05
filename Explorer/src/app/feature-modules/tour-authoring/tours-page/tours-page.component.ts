import { Component } from '@angular/core';
import { TourCard } from '../../tour-authoring/model/tour-card.model';
import { TourAuthoringService } from '../tour-authoring.service';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';

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

  if (centerLat === null || centerLong === null || radiusKm === 0) {
      console.error("Center coordinates or radius not set.");
      return;
  }

 
  const deltaLat = radiusKm / 111;
  const startLat = centerLat - deltaLat;
  const endLat = centerLat + deltaLat;

  const deltaLong = radiusKm / (111 * Math.cos(centerLat * Math.PI / 180));
  const startLong = centerLong - deltaLong;
  const endLong = centerLong + deltaLong;

  const searchParams = { 
      page: this.currentPage, 
      pageSize: 8, 
      startLat, 
      endLat, 
      startLong, 
      endLong 
  };

  console.log("Search boundaries:", searchParams); 

 
  this.tourService.getPublishedTourCardsFiltered(searchParams).subscribe({
      next: (result) => {
          this.tours = result;
          console.log("Filtered tours:", this.tours);
      },
      error: (error) => {
          console.error("Error fetching filtered tours:", error);
      }
  });
}



  detailedTour(tour: TourCard): void {
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


