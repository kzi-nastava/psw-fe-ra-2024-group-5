import { Component, EventEmitter, Output } from '@angular/core';
import { Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'xp-app-rating-dialog',
  templateUrl: './app-rating-dialog.component.html',
  styleUrls: ['./app-rating-dialog.component.css'],
})
export class AppRatingDialogComponent {
  grade: number = 0; // Declare and initialize grade (1–5)
  comment: string = ''; // Declare comment as a string

  constructor(@Inject(MAT_DIALOG_DATA) public data: { grade: number, comment: string }) {
    if (data) {
      this.grade = data.grade || 0;
      this.comment = data.comment || '';
    }
  }

  @Output() submitRating = new EventEmitter<{ grade: number; comment: string }>();

  onSubmit() {
    if (this.grade > 0 && this.comment.trim()) {
      this.submitRating.emit({ grade: this.grade, comment: this.comment }); // Emit the rating and comment
    } else {
      alert('Please provide a rating and a comment before submitting.');
    }
  }
}

  