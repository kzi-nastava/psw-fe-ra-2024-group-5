import { Component } from '@angular/core';
import { TourCard } from '../model/tour-card.model';
import { TourCardService } from '../tour-card.service';

@Component({
  selector: 'xp-tour-view',
  templateUrl: './tour-view.component.html',
  styleUrls: ['./tour-view.component.css']
})
export class TourViewComponent {
  tours: TourCard[] = [];
  currentPage = 1;
  cards = Array(8).fill(0);
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

  getColor(index: number): string {
    // Assign colors based on index
    const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A6', '#FF8333', '#33FFC4', '#A633FF', '#FFD133'];
    return colors[index % colors.length];
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
