import { Component } from '@angular/core';
import { TourCard } from '../../tour-authoring/model/tour-card.model';
import { TourAuthoringService } from '../tour-authoring.service';
import { Router } from '@angular/router';

@Component({
  selector: 'xp-tours-page',
  templateUrl: './tours-page.component.html',
  styleUrls: ['./tours-page.component.css']
})
export class ToursPageComponent {
  tours: TourCard[] = [];
  currentPage = 1;
  showSearch: boolean = false;

  constructor(private tourService: TourAuthoringService, private router: Router){
    this.loadTours();
  }

  loadTours(): void{
    this.tourService.getPublishedTourCards(this.currentPage,8).subscribe({
      next: (result: TourCard[]) => {
        this.tours = result
        console.log(this.tours)
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

  detailedTour(tour: TourCard): void{
    this.router.navigate(['/tour-detailed-view', tour.id]);
  }
}
