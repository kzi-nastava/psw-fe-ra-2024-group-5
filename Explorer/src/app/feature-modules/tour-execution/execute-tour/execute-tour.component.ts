import { Component } from '@angular/core';
import { TokenStorage } from 'src/app/infrastructure/auth/jwt/token.service';
import { TourExecutionService } from '../tour-execution.service';
import { TourExecution } from '../model/tour-execution.model';
import { Tour } from 'src/app/feature-modules/tour-authoring/model/tour.model';
import { TourAuthoringService } from '../../tour-authoring/tour-authoring.service';
import { Position } from '../model/position.model';
import { UserLocationService } from 'src/app/shared/user-location/user-location.service';
import { EMPTY, interval, Subscription } from 'rxjs';
import { concatMap, takeWhile } from 'rxjs/operators';
import { UserPosition } from 'src/app/shared/model/userPosition.model';
import { CompletedKeyPoint } from '../model/completed-key-point.model';
import { MatGridList } from '@angular/material/grid-list';
import { MatDialog } from '@angular/material/dialog';
import { CompletedKeyPointDetailsComponent } from '../completed-key-point-details/completed-key-point-details.component';

@Component({
  selector: 'xp-execute-tour',
  templateUrl: './execute-tour.component.html',
  styleUrls: ['./execute-tour.component.css']
})
export class ExecuteTourComponent {
  noActiveTours: boolean = true;
  tourExecution: TourExecution;
  tour: Tour | null = null;
  completedKeyPoints: CompletedKeyPoint[] = [];
  tourActive: boolean = false;
  private intervalSubscription: Subscription | null = null;

  constructor(
    private service: TourExecutionService,
    private tourService: TourAuthoringService,
    private tokenStorage: TokenStorage,
    private userLocationService: UserLocationService,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    const userId = this.tokenStorage.getUserId();
    if (!userId)
      return;

    this.service.getActiveTourExecution(userId).subscribe({
      next: tourExecution => {
        this.tourExecution = tourExecution;
        this.noActiveTours = false;
        this.completedKeyPoints = this.tourExecution.keyPointProgresses;

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

  getTotalNodes(): number[] {
    return Array(this.tour?.keyPoints?.length ? this.tour.keyPoints.length + 1 : 0);
  }
  
  getDotPosition(index: number): string {
    const totalNodes = this.tour?.keyPoints?.length ? this.tour.keyPoints.length + 1 : 0;
    if (totalNodes <= 1) return '0%';
    const percentage = (index / (totalNodes - 1)) * 100;
    return `${percentage}%`;
  }
  
  getCompletionPercentage(): number {
    if (!this.tour?.keyPoints?.length) return 0;
    if (this.completedKeyPoints.length === 0) return 0;
    return (this.completedKeyPoints.length / this.tour.keyPoints.length) * 100;
  }

  startTour() {
    this.tourActive = true;
    this.trackTour();
  }

  stopTour() {
    this.tourActive = false;
    this.clearInterval();
    console.log("Tura je zavrsena");
  }

  onUserLocationChange(location: [number, number]): void {
    if(!this.tourActive)
      this.startTour();
  }

  getPosition(): Position | null{
    const userPosition: UserPosition | null = this.userLocationService.getUserPosition();
    
    if(!userPosition)
      return null;

    return {
      latitude: userPosition.latitude,
      longitude: userPosition.longitude
    }
  }

  private trackTour() {
    if (this.intervalSubscription) {
      this.clearInterval();
    }

    this.intervalSubscription = interval(10000) // 10 seconds
      .pipe(
        takeWhile(() => this.tourActive),
        concatMap(() => {
          var position = this.getPosition()

          if(!position)
            return EMPTY;

          return this.service.progressTour(position, this.tourExecution.id);
        })
      )
      .subscribe({
        next: (response) => {
          if(!response)
            return;

          this.completedKeyPoints.push(response);
          this.openDialog(response)

          this.service.checkIfCompleted(this.tourExecution.id).subscribe({
            next: (response) => {
              if(response)
                this.stopTour();
            },
            error: (error) => {
              console.error(error);
            }
          });
        },
        error: (error) => {
          console.error('Request failed', error);
        }
      });
  }

  openDialog(keyPoint: CompletedKeyPoint) {
    this.dialog.open(CompletedKeyPointDetailsComponent, {
      data: keyPoint
    });
  }

  private clearInterval() {
    if (this.intervalSubscription) {
      this.intervalSubscription.unsubscribe();
      this.intervalSubscription = null;
    }
  }

  ngOnDestroy() {
    this.clearInterval();
  }

  abandonTour(): void {
    this.service.abandonTour(this.tourExecution.id).subscribe({
      next: () => {
        this.stopTour();
        window.location.reload();
      }
    });
  }
}
