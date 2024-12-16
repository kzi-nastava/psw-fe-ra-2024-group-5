import { Component, OnInit, ViewChild } from '@angular/core';
import { TourAuthoringService } from '../tour-authoring.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Tour, TourReview, TourTourist } from '../model/tour.model';
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
import { NavbarComponent } from '../../layout/navbar/navbar.component';
import { CompletedKeyPointDetailsComponent } from '../../tour-execution/completed-key-point-details/completed-key-point-details.component';
import { UserProfileService } from '../../administration/user-profile.service';
import { UserProfileBasic } from '../../administration/model/userProfileBasic.model';

@Component({
  selector: 'xp-tour-detailed-view',
  templateUrl: './tour-view.component.html',
  styleUrls: ['./tour-view.component.css']
})
export class TourDetailedViewComponent implements OnInit {
  isEditable: boolean = false;
  user: User | undefined;
  tour: Tour | undefined;
  reviews: TourReview[] = [];
  tourId: number;
  @ViewChild(MapComponent) map: MapComponent;
  canBeBought: boolean = false;
  canBeActivated: boolean = false;
  canBeReviewed: boolean = false;
  showPublishForm = false;

  public Currency = Currency;
  newPrice: number;
  newCurrency: Currency = Currency.AC;

  kpImageIndex: number = 0;

  @ViewChild(NavbarComponent) navbarComponent: NavbarComponent | null = null;

  userProfiles: UserProfileBasic[] = [];



  constructor(
    private service: TourAuthoringService,
    private tourExecutionService: TourExecutionService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private reviewService: ReviewService,
    private shoppingCartService: ShoppingCartService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private userProfileService: UserProfileService
  ) { }

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });

    this.initializeTour();
  }

  private initializeTour(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('tourId');
      this.tourId = Number(id);

      this.addViewToTour();

      if (this.user?.role === 'author')
        this.loadTourDetails(this.tourId);
      if (this.user?.role === 'tourist')
        this.loadTourTouristDetails(this.tourId, this.user.id);

      this.loadReviews(this.tourId, this.user!.id);
    });
  }

  private loadReviews(tourId: number, userId: number | null) {
    this.service.getTourReviews(tourId, userId).subscribe(
      {
        next: (res) => this.reviews = res,
        error: (e) => console.error(e)
      }
    )
  }

  private addViewToTour(): void {
    this.service.addViewToTour(this.tourId).subscribe({
      next: () => {
      },
      error: (err: any) => {
        console.log(err);
      }
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
        this.loadUserProfiles();
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  private loadTourTouristDetails(tourId: number, touristId: number): void {
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
        this.loadUserProfiles();
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  loadUserProfiles() {

    if (this.tour && this.tour.reviews && this.tour.reviews.length > 0) {
      console.log('Reviews found:', this.tour.reviews);

      const touristIds = this.tour.reviews
        .map(review => review.touristId)
        .filter((id): id is number => id !== undefined);

      console.log('Filtered touristIds:', touristIds);

      this.userProfileService.getBasicProfiles(touristIds).subscribe({
        next: (profiles) => {
          this.userProfiles = profiles;
        },
        error: (error) => {
          console.error('Error loading user profiles:', error);
        }
      });
    } else {
      console.log('No reviews found or tour not loaded yet');
    }
  }

  getUserProfile(touristId: number): UserProfileBasic | undefined {
    const profile = this.userProfiles.find(profile => profile.userId === touristId);
    return profile;
  }

  getKeyPointImage(): string {
    if (!this.tour || !this.tour.keyPoints[this.kpImageIndex].image) {
      return '';
    }
    return `data:image/jpeg;base64,${this.tour.keyPoints[this.kpImageIndex].image}`
  }

  hasMultipleImages(): boolean {
    if (!this.tour)
      return false;

    return this.tour?.keyPoints?.length > 1 && this.tour.keyPoints.some(kp => kp.image);
  }

  onPreviousImage(): void {
    const keypointsLength = this.tour?.keyPoints.length;
    if (!keypointsLength)
      return;

    if (this.kpImageIndex > 0) {
      this.kpImageIndex--;
    }
    else {
      this.kpImageIndex = keypointsLength - 1;
    }
  }

  onNextImage(): void {
    const keypointsLength = this.tour?.keyPoints.length;
    if (keypointsLength == undefined)
      return;

    if (this.kpImageIndex < keypointsLength - 1) {
      this.kpImageIndex++;
    }
    else {
      this.kpImageIndex = 0;
    }
  }

  getAverageRating(): number {
    if (!this.tour) {
      return 0.0;
    }

    const reviews = this.tour.reviews;
    if (reviews.length === 0) {
      return 0.0;
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    // Round to one decimal place
    return Math.round(averageRating * 10) / 10;
  }


  displayKeyPoints(): void {
    this.tour?.keyPoints.forEach(element => {
      this.map.addKeyPointMarker([element.latitude, element.longitude], element.name);
    });
  }

  back(): void {
    this.router.navigate(['/']);
  }

  openKeyPointDialog(keyPoint: KeyPoint) {
    this.dialog.open(CompletedKeyPointDetailsComponent, {
      data: {
        keyPoint: keyPoint,
        isExe: false
      }
    });
  }

  getTourLevel(level: number | undefined): string {
    if (level === undefined) return 'N/A';
    return TourLevel[level] !== undefined ? TourLevel[level] : 'N/A';
  }

  getTourLevelStyle(level: number | undefined): string {

    switch (level) {
      case TourLevel.Beginner:
        return 'background: #5fff5c;'
        break;
      case TourLevel.Intermediate:
        return 'background: #ffba42;'
        break;
      case TourLevel.Advanced:
        return 'background: #ff5c5c;'
        break;
      default:
        return ''
        break;
    }
  }

  splitTags(tags: string | undefined): string[] | undefined {
    return tags?.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
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
        if (this.user?.id) {
          this.loadTourTouristDetails(this.tourId, this.user.id);
        }
        this.showSuccessAlert('Review successfully submitted!');
        console.log('Review successfully submitted');
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

  publishTour(): void {
    if (this.tour?.id) {
      if (!Object.values(Currency).includes(this.newCurrency)) {
        console.error('Invalid currency');
        return;
      }
      this.service.publishTour(this.tour.id, this.newPrice, this.newCurrency).subscribe({
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



  addToCart(): void {
    if (!this.tour || !this.tour.id || !this.user)
      return;

    let orderItem: OrderItem = {
      tourId: this.tour.id,
      tourName: this.tour.name,
      price: this.tour.price,
      description: this.tour.description,
      tags: this.tour.tags,
      showOldPrice: true
    }

    console.log(orderItem)

    this.shoppingCartService.addItemToCart(orderItem, this.user?.id).subscribe({
      next: () => {
        this.initializeTour();
        if (this.navbarComponent) {
          this.navbarComponent.itemsCount++;
          this.navbarComponent.getItemsCount();
        }
        if (this.user?.id) {
          this.shoppingCartService.updateItemsCount(this.user.id); // Ažuriranje preko BehaviorSubject-a
        }
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  togglePublishForm() {
    this.showPublishForm = !this.showPublishForm;
  }

  currencyToEnum(currency: number): Currency | null {
    switch (currency) {
      case 0:
        return Currency.AC;
      case 1:
        return Currency.Dol;
      case 2:
        return Currency.Eur;
      case 3:
        return Currency.Rsd;
      default:
        console.error('Invalid currency value:', currency);
        return null;
    }
  }

  publishTourWithPrice(): void {
    if (this.newPrice != null && this.newCurrency !== undefined) {
      if (!Object.values(Currency).includes(this.newCurrency)) {
        console.error('Invalid currency value:', this.newCurrency);
        alert('Invalid currency');
        return;
      }
      if (this.tour?.id) {
        console.log('Publishing tour:', this.tour.id, 'with price:', this.newPrice, 'and currency:', this.newCurrency);
        this.service.publishTour(this.tour.id, this.newPrice, this.newCurrency).subscribe({
          next: () => {
            if (this.tour) {
              this.tour.status = TourStatus.Published;
            }
            console.log('Tour published with new price and currency');
            this.showPublishForm = false;
            this.initializeTour();
          },
          error: (error) => {
            console.error('Error publishing tour:', error);
            alert('Error publishing tour: ' + error.message);
          }
        });
      } else {
        alert('Tour ID is missing.');
      }
    } else {
      alert('Please enter both price and currency.');
    }
  }
}