import { Component } from '@angular/core';
import { TourCard } from '../../tour-authoring/model/tour-card.model';
import { TourAuthoringService } from '../../tour-authoring/tour-authoring.service';
import { Router } from '@angular/router';
//import { Blog } from '../../blog/model/blog.model';

@Component({
  selector: 'xp-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent {
  recommendedTours: TourCard[] = [];
  //recommendedBlogs: Blog[] = [];

  constructor(private tourService: TourAuthoringService, private router: Router){
    this.loadTours();
  }

  loadTours(): void{
    this.tourService.getPublishedTourCards(1,4).subscribe({
      next: (result: TourCard[]) => {
        this.recommendedTours = result
        console.log(this.recommendedTours)
      },
      error: () => {}
    });
  }

  detailedTour(tour: TourCard): void{
    this.router.navigate(['/tour-detailed-view', tour.id]);
  }
}
