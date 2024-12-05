import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ReviewService } from '../tour-review-form/tour-review.service';
import { TourReview } from '../../tour-authoring/model/tour.model';

@Component({
  selector: 'xp-tour-review-form',
  templateUrl: './tour-review-form.component.html',
  styleUrls: ['./tour-review-form.component.css']
})
export class TourReviewFormComponent {
  reviewForm: FormGroup;
  selectedImage: string | ArrayBuffer | null = null;

  constructor(
    private fb: FormBuilder,
    private reviewService: ReviewService,
    public dialogRef: MatDialogRef<TourReviewFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { tourId: number, touristId: number }
  ) {
    this.reviewForm = this.fb.group({
      rating: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: ['', Validators.required],
      image: [null]
    });
  }

  setRating(rating: number): void {
    this.reviewForm.patchValue({ rating });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement; 
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
    
      reader.onload = (e) => {
        if (e.target?.result) {
          this.selectedImage = e.target.result as string; 
          this.reviewForm.patchValue({
            image: this.selectedImage.split(',')[1] 
          });
        }
      };
    
      reader.readAsDataURL(file); 
    }
  }

  convertToBase64(file: File): void {
    const reader = new FileReader();
    reader.onload = () => {
      this.reviewForm.patchValue({
        image: reader.result?.toString().split(',')[1]
      });
    };
    reader.readAsDataURL(file);
  }

  onSubmit(): void {
    if (this.reviewForm.valid) {
      const review: TourReview = {
        ...this.reviewForm.value,
        tourId: this.data.tourId,
        touristId: this.data.touristId,
        visitDate: new Date(),
        reviewDate: new Date()
      };

      this.reviewService.createReview(review).subscribe({
        next: () => {
          this.dialogRef.close(true);
        },
        error: (error: any) => {
          console.error('Error creating review:', error);
          this.dialogRef.close(false);
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}