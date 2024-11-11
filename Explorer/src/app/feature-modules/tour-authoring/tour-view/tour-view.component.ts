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
import { ShoppingCartService } from '../../marketplace/shopping-cart/shopping-cart.service';
import { OrderItem } from '../../marketplace/model/order-item.model';
import { MatDialog } from '@angular/material/dialog';
import { TourReviewFormComponent } from '../../marketplace/tour-review-form/tour-review-form.component';
import { ReviewService } from '../../marketplace/tour-review-form/tour-review.service';
import { MatSnackBar } from '@angular/material/snack-bar';
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
    private router: Router,
    private reviewService: ReviewService,
    private shoppingCartService: ShoppingCartService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });

    this.initializeTour();
  }

  private initializeTour(): void{
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
            this.displayKeyPoints()
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
            this.canBeActivated = result.canBeActivated
            this.canBeBought = result.canBeBought
            this.canBeReviewed = result.canBeReviewed
            this.displayKeyPoints()
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

  openReviewDialog(): void {
    const dialogRef = this.dialog.open(TourReviewFormComponent, {
      width: '600px',
      data: {
        tourId: this.tour?.id,
        touristId: this.user?.id
      }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.showSuccessAlert('Review successfully submitted!');
        console.log('Review successfully submitted');
  
        const reviewUrl = this.reviewService.getReviewUrl();
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate([`${reviewUrl}/${this.tour?.id}`]); 
        });
      } else if (result === false) {
        this.showErrorAlert('Error submitting review. Please try again.');
        console.log('Error submitting review');
      }
    });
  }
  
  private showSuccessAlert(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['alert-success', 'custom-snackbar']
    });
  }
  
  private showErrorAlert(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['alert-danger', 'custom-snackbar']
    });
  }

  addToCart(): void{
    if(!this.tour || !this.tour.id || !this.user)
      return;

    const orderItem :OrderItem = {
      tourId : this.tour.id,
      tourName : this.tour.name,
      price: this.tour.price
    }

    this.shoppingCartService.addItemToCart(orderItem, this.user?.id).subscribe({
      next: () => {
        this.initializeTour();
      },
      error: (err: any) => {
          console.log(err);
      }
  });

  }
}
