import { Component } from '@angular/core';
import { TokenStorage } from 'src/app/infrastructure/auth/jwt/token.service';
import { TourExecutionService } from '../tour-execution.service';
import { TourExecution } from '../model/tour-execution.model';
import { Tour } from 'src/app/feature-modules/tour-authoring/model/tour.model';
import { TourAuthoringService } from '../../tour-authoring/tour-authoring.service';

@Component({
  selector: 'xp-execute-tour',
  templateUrl: './execute-tour.component.html',
  styleUrls: ['./execute-tour.component.css']
})
export class ExecuteTourComponent {
  noActiveTours: boolean = true;
  tourExecution: TourExecution;
  tour: Tour;

  constructor(
    private service: TourExecutionService,
    private tourService: TourAuthoringService,
    private tokenStorage: TokenStorage) { }

  ngOnInit(): void {
    const userId = this.tokenStorage.getUserId();
    if (!userId)
      return;

    this.service.getActiveTourExecution(userId).subscribe({
      next: tourExecution => {
        this.tourExecution = tourExecution;
        this.noActiveTours = false;
        const tourId = this.tourExecution.tourId;
        if (!tourId)
          return;

        this.tourService.getTourForTouristById(tourId, userId).subscribe({
          next: tour => {
            this.tour = tour.tour;
          },
          error: error => {
            console.log('Error fetching tour:', error.status);
          }
        });
      },
      error: error => {
        this.noActiveTours = true;
        console.log('Error fetching active tour:', error.status);
      }
    });
  }
}
