import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { RatingConfirmationDialogComponent } from './rating-confirmation-dialog/rating-confirmation-dialog.component';

@Component({
  selector: 'xp-app-rating-form',
  templateUrl: './app-rating-form.component.html',
  styleUrls: ['./app-rating-form.component.css']
})
export class AppRatingFormComponent implements OnInit {
  grade: number = 0;
  comment: string = '';
  isEditMode: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<AppRatingFormComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    if (this.data && this.data.grade !== undefined && this.data.comment !== undefined) {
      this.grade = this.data.grade;
      this.comment = this.data.comment;
      this.isEditMode = true;  
    }
  }

  onSubmit(): void {
    if (this.grade > 0 && this.comment.trim() !== '') {
      const ratingData = {
        grade: this.grade,
        comment: this.comment
      };
  
      
      localStorage.setItem('userRating', JSON.stringify(ratingData));
  
      
      this.dialogRef.close(ratingData);
  
     
      const dialogRef = this.dialog.open(RatingConfirmationDialogComponent, {
        width: '400px',
        height: '130px',
      });
  
     
      setTimeout(() => {
        dialogRef.close();
        this.dialogRef.afterClosed().subscribe(() => {
          
          window.location.href = '/';  
        });
      }, 3000); 
    } else {
      console.log('Please provide both a rating and a comment');
    }
  }
  

  onDelete(): void {
    
    const dialogRef = this.dialog.open(RatingConfirmationDialogComponent, {
      width: '400px',
      data: { message: 'Are you sure you want to delete your rating?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'confirmed') {
        
        this.dialogRef.close(null);  
      }
    });
  }

  closeDialog(): void {
    this.dialogRef.close(); 
  }
}
