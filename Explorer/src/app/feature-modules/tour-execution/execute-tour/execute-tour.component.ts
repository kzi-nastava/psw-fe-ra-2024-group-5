import { Component } from '@angular/core';
import { TokenStorage } from 'src/app/infrastructure/auth/jwt/token.service';
import { TourExecutionService } from '../tour-execution.service';
import { TourExecution } from '../model/tour-execution.model';
import { Tour } from 'src/app/feature-modules/tour-authoring/model/tour.model';
import { TourAuthoringService } from '../../tour-authoring/tour-authoring.service';
import { Position } from '../model/position.model';

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

        this.tourService.getTourForTouristById(this.tourExecution.tourId, userId).subscribe({
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

  onUserLocationChange(location: [number, number]): void {
    const position: Position = {
      latitude: location[0],
      longitude: location[1]
    };

    this.service.progressTour(position, this.tourExecution.id).subscribe({
      next: () => {
        console.log('Position updated');
      },
      error: error => {
        console.log('Error updating position:', error.status);
      }
    });
  }

  abandonTour(): void {
    this.service.abandonTour(this.tourExecution.id).subscribe({
      next: () => {
        window.location.reload();
      }
    });
  }
}
