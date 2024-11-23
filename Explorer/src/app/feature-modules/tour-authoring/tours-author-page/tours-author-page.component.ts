import { Component } from '@angular/core';
import { TourCard } from '../../tour-authoring/model/tour-card.model';
import { TourAuthoringService } from '../tour-authoring.service';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';

@Component({
  selector: 'xp-tours-author-page',
  templateUrl: './tours-author-page.component.html',
  styleUrls: ['./tours-author-page.component.css']
})
export class ToursAuthorPageComponent {
  tours: TourCard[] = [];
  currentPage = 1;
  showSearch: boolean = false;
  user: User;
  startLatitude: number = 0;
  endLatitude: number = 0;
  startLongitude: number = 0;
  endLongitude: number = 0;
  searchRadius: number = 0;
  radiusInput: number = 0;
  centerLatitude = new BehaviorSubject<number | null>(null);
  centerLongitude = new BehaviorSubject<number | null>(null);
  radius = new BehaviorSubject<number>(0);

  constructor(private tourService: TourAuthoringService, private authService: AuthService, private router: Router){
    
    this.authService.user$.subscribe(user => {
      this.user = user;
      this.loadTours();
    });
  }

  loadTours(): void {
    if(this.user.role === 'author'){
      this.tourService.getAuthorTours(this.user, this.currentPage, 8).subscribe({
        next: (result: TourCard[]) => {
          this.tours = result
          console.log(this.tours)
        },
        error: (err: any) => {
          console.log(err)
        }
     });
    }else{
      this.tourService.getPublishedTourCards(this.currentPage, 8).subscribe({
        next: (result: TourCard[]) => {
          this.tours = result;
          console.log(this.tours);
        },
        error: () => {}
      });
    }
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

  if(this.user.role === 'author'){
    this.tourService.getAuthorTourCardsFiltered(this.user, searchParams).subscribe({
      next: (result) => {
          this.tours = result;
          console.log("Filtered tours:", this.tours);
      },
      error: (error) => {
        console.error("Error fetching filtered tours:", error);
      }
    });
  }else{
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
}



  detailedTour(tour: TourCard): void {
    this.router.navigate(['/tour-detailed-view', tour.id]);
  }
}
