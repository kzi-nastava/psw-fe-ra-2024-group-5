import { Component, OnInit, ViewChild } from '@angular/core';
import { TourAuthoringService } from '../tour-authoring.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Tour, TourTourist } from '../model/tour.model';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { KeyPoint } from '../model/key-point.model';
import { MapComponent } from 'src/app/shared/map/map.component';
import { TourLevel, TourStatus, Currency, TourTransport } from '../model/tour.enums'; // Import the enums
import { TourExecutionService } from '../../tour-execution/tour-execution.service';

@Component({
  selector: 'xp-tour-detailed-view',
  templateUrl: './tour-view.component.html',
  styleUrls: ['./tour-view.component.css']
})
export class TourDetailedViewComponent implements OnInit {
  isEditable: boolean = false;
  user: User | undefined;
  tour: Tour | undefined;
  tourId: number;
  @ViewChild(MapComponent) map: MapComponent;
  canBeBought: boolean = false;
  canBeActivated: boolean = false;
  canBeReviewed: boolean = false;

  constructor(
    private service: TourAuthoringService,
    private tourExecutionService: TourExecutionService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });

    this.route.paramMap.subscribe(params => {
      const id = params.get('tourId');
      this.tourId = Number(id);

      if (this.user?.role === 'author')
        this.loadTourDetails(this.tourId);
      if (this.user?.role === 'tourist')
        this.loadTourTouristDetails(this.tourId, this.user.id);
    });
  }

  private loadTourDetails(tourId: number): void {
    this.service.getTourbyId(tourId).subscribe({
        next: (result: Tour) => {
            this.tour = {
                ...result,
                level: result.level as TourLevel, // Ensure it's cast to enum
                status: result.status as TourStatus, // Ensure it's cast to enum
                price: {
                    ...result.price,
                    currency: result.price.currency as Currency // Ensure it's cast to enum
                }
            };
            console.log('Loaded Tour:', this.tour);
        },
        error: (err: any) => {
            console.log(err);
        }
    });
  }

  private loadTourTouristDetails(tourId: number, touristId : number): void {
    this.service.getTourForTouristById(tourId, touristId).subscribe({
        next: (result: TourTourist) => {
            this.tour = {
                ...result.tour,
                level: result.tour.level as TourLevel, // Ensure it's cast to enum
                status: result.tour.status as TourStatus, // Ensure it's cast to enum
                price: {
                    ...result.tour.price,
                    currency: result.tour.price.currency as Currency // Ensure it's cast to enum
                }
            };
            this.canBeActivated = true // THIS IS TEMPORARY, SHOULD BE CHANGED BACK
            this.canBeBought = result.canBeBought
            this.canBeReviewed = result.canBeReviewed

            console.log('Loaded Tour for tourist:', result);
        },
        error: (err: any) => {
            console.log(err);
        }
    });
  }


  displayKeyPoints(): void {
    this.tour?.keyPoints.forEach(element => {
      this.map.addKeyPointMarker([element.latitude, element.longitude], element.name);
    });
  }

  back(): void {
    this.router.navigate(['/']);
  }

  getTourLevel(level: number | undefined): string {
    if (level === undefined) return 'N/A';
    return TourLevel[level] !== undefined ? TourLevel[level] : 'N/A';
  }

  getTourStatus(status: number | undefined): string {
      if (status === undefined) return 'N/A';
      return TourStatus[status] !== undefined ? TourStatus[status] : 'N/A';
  }

  getCurrency(currency: number | undefined): string {
      if (currency === undefined) return 'N/A';
      return Currency[currency] !== undefined ? Currency[currency] : 'N/A';
  }

  getTransport(transport: number | undefined): string {
      if (transport === undefined) return 'N/A';
      return TourTransport[transport] !== undefined ? TourTransport[transport] : 'N/A';
  }

  startTour(): void {
    const userId = this.user?.id;
    const tourId = this.tour?.id;

    if (userId == undefined || tourId == undefined)
      return;

    this.tourExecutionService.startTour(userId, tourId).subscribe({
      next: execution => {
        this.router.navigate(['/tour-execution']);
      },
      error: error => {
        console.log('Error starting tour:', error);
      }
    });
  }

  publishTour(): void {
    if (this.tour?.id) {
      this.service.publishTour(this.tour.id).subscribe({
        next: () => {
          if (this.tour) {
            this.tour.status = TourStatus.Published;
          }
          console.log('Tour published');
        },
        error: (error) => {
          console.error('Error publishing tour:', error);
        }
      });
    }
  }

  archiveTour(): void {
    if (this.tour?.id) {
      this.service.archiveTour(this.tour.id).subscribe({
        next: () => {
          if (this.tour) {
            this.tour.status = TourStatus.Archived;
          }
          console.log('Tour archived');
        },
        error: (error) => {
          console.error('Error archiving tour:', error);
        }
      });
    }
  }
}
