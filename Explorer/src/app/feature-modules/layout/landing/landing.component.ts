import { Component } from '@angular/core';
import { TourCardService } from '../../tour-tourist/tour-card.service';
import { TourCard } from '../../tour-tourist/model/tour-card.model';
//import { Blog } from '../../blog/model/blog.model';

@Component({
  selector: 'xp-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent {
  recommendedTours: TourCard[] = [];
  //recommendedBlogs: Blog[] = [];

  constructor(private tourCardService: TourCardService){
    this.loadTours();
  }

  loadTours(): void{
    this.tourCardService.getTourCards(1,4).subscribe({
      next: (result: TourCard[]) => {
        this.recommendedTours = result
        console.log(this.recommendedTours)
      },
      error: () => {}
    });
  }

}
