import { Component, OnInit } from '@angular/core';
import { Coupon } from '../model/coupon.model';
import { CouponsService } from '../coupons/coupons.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { CouponFormService } from './coupon-form.service';
import { Router } from '@angular/router';
import { TourCard } from '../../tour-authoring/model/tour-card.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserProfile } from '../../administration/model/userProfile.model';



@Component({
  selector: 'xp-coupon-form',
  templateUrl: './coupon-form.component.html',
  styleUrls: ['./coupon-form.component.css']
})
export class CouponFormComponent implements OnInit {

  couponForm!: FormGroup;
  newCoupon: Coupon = {
    id: 0,
    code: '',
    percentage: 0,
    expiredDate: new Date(),
    tourIds: []
  };
  errorMessage: string = '';
  successMessage: string = ''; 
  coupons: Coupon[] = []; // Lista kupona (ovde čuvaš sve kuponi)

  tours : TourCard[] = []; // Lista dostupnih tura
  selectedTours: number[] = []; // IDs selektovanih tura
  currentPage = 1;

  userProfile: UserProfile | undefined;

  constructor(private couponFormService:CouponFormService,private cs : CouponsService,
             private router: Router,private fb: FormBuilder
   ) { }

   ngOnInit() {
    this.loadTours();
    this.couponForm = this.fb.group({
      percentage: ['', [Validators.required, Validators.min(1), Validators.max(100)]],
      expiredDate: ['', Validators.required],
      selectedTours: [[]]  // Lista selektovanih tura 
    });
    
  }

  loadTours() {
    this.couponFormService.getPublishedTourCards(this.currentPage, 8).subscribe(
      (tours) => {
        this.tours = tours;

        
      // Za svaku turu pozivamo servis za preuzimanje slike
      this.tours.forEach(tour => {
        this.cs.getTourImage(tour.id).subscribe(
          (response: Blob) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              tour.imageUrl = reader.result as string;  // Dodeljujemo sliku
            };
            reader.readAsDataURL(response); // Pretvaranje Blob-a u Data URL
          },
          (error) => {
            console.error('Error fetching image for tour:', tour.id, error);
            tour.imageUrl = ''; // Ako dođe do greške, postavljamo prazan URL
          }
        );
      });
    },
    (error) => {
      this.errorMessage = 'Failed to load tours.';
    }
  );
  }

  toggleTourSelection(tour: any) {
    if (this.selectedTours.includes(tour.id)) {
      this.selectedTours = this.selectedTours.filter(t => t !== tour.id);
    } else {
      this.selectedTours.push(tour.id);
    }
  }
  isTourSelected(tour: any): boolean {
    return this.selectedTours.includes(tour.id);
  }

  
 /* resetSelectedTours() {
    this.selectedTours = [];
  }*/
  

   createCoupon() {
    //this.resetSelectedTours();

    this.newCoupon.percentage = Number(this.newCoupon.percentage);

    if (this.selectedTours.length === 0) {
      this.errorMessage = 'Please select at least one tour.';
      return;  
    }

  this.newCoupon.tourIds = this.selectedTours;

    this.couponFormService.createCoupon(this.newCoupon).subscribe({
      next: (coupon) => {
        this.successMessage = 'Coupon created successfully!';
        console.log('Coupon created:', coupon);
        this.coupons.push(coupon);  
        //this.cs.getAllCoupons(); // Osveži ture nakon što je kupon kreiran
        this.router.navigate(['/view-coupons']); 
      },
      error: (error) => {
        this.errorMessage = 'Error creating coupon. Please try again later.';
        console.error('Error:', error);
      }
    });
  }

  
}
