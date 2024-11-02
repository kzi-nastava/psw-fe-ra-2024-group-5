import { Component } from '@angular/core';
import { TourCard } from '../../tour-authoring/model/tour-card.model';
import { TourAuthoringService } from '../tour-authoring.service';

@Component({
  selector: 'xp-tours-page',
  templateUrl: './tours-page.component.html',
  styleUrls: ['./tours-page.component.css']
})
export class ToursPageComponent {
  tours: TourCard[] = [];
  currentPage = 1;
  showSearch: boolean = false;

  constructor(private tourService: TourAuthoringService){
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
}
