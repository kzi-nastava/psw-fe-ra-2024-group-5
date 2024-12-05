import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CouponsService } from './coupons.service';
import { Coupon } from '../model/coupon.model';
import { Tour } from '../../tour-authoring/model/tour.model';
import { Router } from '@angular/router';
import { UserProfile } from '../../administration/model/userProfile.model';
import { UserProfileService } from '../../administration/user-profile.service';
import { TokenStorage } from 'src/app/infrastructure/auth/jwt/token.service';


@Component({
  selector: 'xp-coupons',
  templateUrl: './coupons.component.html',
  styleUrls: ['./coupons.component.css']
})
export class CouponsComponent implements OnInit {

  coupons: Coupon[] = []; 
  errorMessage: string = ''; 
  tours: Tour[] = []; // Niz za čuvanje povezanih tura

  selectedCoupon: any;  // Trenutni kupon koji se edituje
  isEditModalOpen = false;  // Kontrola za otvaranje/zatvaranje modala

  userProfile: UserProfile | undefined;
  userId: number;


  constructor(private couponsService: CouponsService,private router: Router,private service : UserProfileService,
    private tokenStorage: TokenStorage
  ) { }

  detailedAboutTour(tourId: number | undefined): void {
    if (tourId) {
      this.router.navigate(['/tour-detailed-view', tourId]);
    } else {
      console.error('Tour ID is undefined. Navigation aborted.');
    }
  }

    openEditModal(coupon: any) {
    this.selectedCoupon = { ...coupon };  // Priprema kopiju kupona za izmenu
    this.isEditModalOpen = true;
  }

  closeEditModal() {
    this.isEditModalOpen = false;
  }

  ngOnInit(): void {
    this.loadCoupons();
    this.loadRelatedTours();

    //this.userId = 2;  
    this.userId = this.tokenStorage.getUserId() ?? 0;

    if (this.userId != null) {
      this.service.getUserProfile(this.userId).subscribe({
        next: (result: UserProfile) => {
          this.userProfile = result;
        },
        error: (err: any) => {
          console.log(err);
        }
      });
    } else {
      console.error('Korisnički ID nije validan');
    }
  }
  

  loadCoupons(): void {
    this.couponsService.getAllCoupons().subscribe({
      next: (coupons) => {
        this.coupons = coupons;
        this.loadRelatedTours();  // Pozivamo učitavanje tura kada su kuponi učitani
      },
      error: (error) => {
        this.errorMessage = 'Error loading coupons!';
        console.error(error);
      }
    });
  }

  loadRelatedTours(): void {
    // Kreiranje liste ID-jeva tura koje su povezane sa kuponima
    const tourIds = this.coupons.flatMap(coupon => coupon.tourIds);
    
    // Ako postoji barem jedan tourId, pozivamo servis da učitamo ture
    if (tourIds.length > 0) {
      this.couponsService.getToursByIds(tourIds).subscribe({
        next: (tours) => {
          this.tours = tours; // Spremamo ture u niz
          // Dodajemo povezanih tura za svaki kupon
          this.coupons.forEach(coupon => {
            coupon.tourName = tours.filter(tour => tour.id !== undefined && coupon.tourIds.includes(tour.id!));
          });
          
        },
        error: (error) => {
          this.errorMessage = 'Error loading related tours!';
          console.error(error);
        }
      });
    }
  }

 

  updateCoupon(coupon: Coupon): void {
    // Provera da li kupon ima validan ID
    if (!coupon.id) {
      console.error('Coupon ID is missing');
      return;
    }
  
    console.log('Sending updated coupon to backend:', coupon);
    
    // Poziv servisa za ažuriranje kupona
    this.couponsService.updateCoupon(coupon.id, coupon).subscribe({
      next: (updatedCoupon) => {
        console.log('Coupon successfully updated:', updatedCoupon);
  
        // Ažuriranje liste kupona u aplikaciji
        const index = this.coupons.findIndex(c => c.id === updatedCoupon.id);
        if (index !== -1) {
          // Ažuriraj postojeći kupon u listi sa novim podacima
          this.coupons[index] = updatedCoupon;
        }
        // this.loadCoupons();
        this.closeEditModal();
      },
      error: (error) => {
        console.error('Error updating coupon:', error);
      }
    });
  }  

  deleteCoupon(id: number): void {
    if (confirm('Are you sure you want to delete this coupon?')) {
      this.couponsService.deleteCoupon(id).subscribe({
        next: () => {
          this.coupons = this.coupons.filter(coupon => coupon.id !== id); 
          console.log('Coupon deleted successfully');
        },
        error: (error) => {
          this.errorMessage = 'Error deleting coupon!';
          console.error(error);
        }
      });
    }
  }


  
}
