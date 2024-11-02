import { Component } from '@angular/core';
import { TourCard } from '../model/tour-card.model';
import { TourCardService } from '../tour-card.service';

@Component({
  selector: 'xp-tours-page',
  templateUrl: './tours-page.component.html',
  styleUrls: ['./tours-page.component.css']
})
export class ToursPageComponent {
  tours: TourCard[] = [];
  currentPage = 1;
  showSearch: boolean = false;

  constructor(private tourCardService: TourCardService){
    this.loadTours();
  }

  loadTours(): void{
    this.tourCardService.getTourCards(this.currentPage,8).subscribe({
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
