import { Component, OnInit } from '@angular/core';
import { CouponsService } from './coupons.service';
import { Coupon } from '../model/coupon.model';
import { Tour } from '../../tour-authoring/model/tour.model';

@Component({
  selector: 'xp-coupons',
  templateUrl: './coupons.component.html',
  styleUrls: ['./coupons.component.css']
})
export class CouponsComponent implements OnInit {

  coupons: Coupon[] = []; 
  errorMessage: string = ''; 
  tours: Tour[] = []; // Niz za čuvanje povezanih tura


  constructor(private couponsService: CouponsService) { }

  ngOnInit(): void {
    this.loadCoupons();
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
   if (!coupon.id) {
    console.error('Coupon ID is missing');
    return;
  }

    console.log('Sending updated coupon to backend:', coupon);
    this.couponsService.updateCoupon(coupon.id, coupon).subscribe({
      next: (updatedCoupon) => {
        console.log('Coupon successfully updated:', updatedCoupon);
        this.loadCoupons(); // Osvežavanje liste nakon ažuriranja
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
