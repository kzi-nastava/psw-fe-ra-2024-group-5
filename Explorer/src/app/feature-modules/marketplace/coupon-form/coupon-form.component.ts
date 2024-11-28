import { Component } from '@angular/core';
import { Coupon } from '../model/coupon.model';
import { CouponsService } from '../coupons/coupons.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { CouponFormService } from './coupon-form.service';
import { Router } from '@angular/router';



@Component({
  selector: 'xp-coupon-form',
  templateUrl: './coupon-form.component.html',
  styleUrls: ['./coupon-form.component.css']
})
export class CouponFormComponent {

  newCoupon: Coupon = {
    id: 0,
    code: '',
    percentage: 0,
    expiredDate: new Date(),
    tourIds: []
  };
  errorMessage: string = '';
  successMessage: string = ''; 

  constructor(private couponFormService:CouponFormService,
             private router: Router
   ) { }
   createCoupon() {
    this.couponFormService.createCoupon(this.newCoupon).subscribe({
      next: (coupon) => {
        this.successMessage = 'Coupon created successfully!';
        console.log('Coupon created:', coupon);
        this.router.navigate(['/view-coupons']); 
      },
      error: (error) => {
        this.errorMessage = 'Error creating coupon. Please try again later.';
        console.error('Error:', error);
      }
    });
  }

  
}
