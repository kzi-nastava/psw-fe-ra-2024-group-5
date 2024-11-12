import { Component } from '@angular/core';
import { TourCard } from '../../tour-authoring/model/tour-card.model';
import { TourAuthoringService } from '../tour-authoring.service';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

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

  constructor(private tourService: TourAuthoringService, private router: Router){
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

  

  nextPage(): void {
    this.currentPage++;
    this.loadTours();
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadTours();
    }
  }

   
  changeLongLat(latLong: number[]): void {
    const [lat, long] = latLong;
    this.centerLatitude.next(lat);
    this.centerLongitude.next(long);
    console.log("Coordinates set to:", lat, long); // Confirm the values are updated
}

onRadiusChange(): void {
  this.radius.next(this.radiusInput); // Update the radius subject with the input value
  console.log("Radius set to:", this.radius.getValue()); // Confirm the radius value
}


  
searchTours(): void {
  // Retrieve values from BehaviorSubjects
  const centerLat = this.centerLatitude.getValue();
  const centerLong = this.centerLongitude.getValue();
  const radiusKm = this.radius.getValue();

  if (centerLat === null || centerLong === null || radiusKm === 0) {
      console.error("Center coordinates or radius not set.");
      return;
  }

  // Calculate the boundaries based on the radius
  const deltaLat = radiusKm / 111;
  const startLat = centerLat - deltaLat;
  const endLat = centerLat + deltaLat;

  const deltaLong = radiusKm / (111 * Math.cos(centerLat * Math.PI / 180));
  const startLong = centerLong - deltaLong;
  const endLong = centerLong + deltaLong;

  const searchParams = { 
      page: 1, 
      pageSize: 8, 
      startLat, 
      endLat, 
      startLong, 
      endLong 
  };

  console.log("Search boundaries:", searchParams); // Log the search parameters

  // Fetch tours within the boundaries
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
}
