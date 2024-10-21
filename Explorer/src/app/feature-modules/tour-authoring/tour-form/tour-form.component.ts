import { Component, Inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TourAuthoringService } from '../tour-authoring.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { Tour } from '../model/tour.model';

@Component({
  selector: 'xp-tour-form',
  templateUrl: './tour-form.component.html',
  styleUrls: ['./tour-form.component.css']
})
export class TourFormComponent {
  form:FormGroup;
  tourLevels:string[]= ['Beginner', 'Intermediate', 'Advanced'];
  author: User | undefined;

  constructor(
    private formBuilder: FormBuilder,
    private tourAuthorinService: TourAuthoringService
  ){
    this.form = this.formBuilder.group({
      Name: ['', Validators.required],
      Description: ['', Validators.required],
      Tags: ['', Validators.required],
      Level: ['Beginner', Validators.required]
    });
  }

  submitForm(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched()
      return;
    }
    const formValue = this.form.value;
    let tour: Tour = {
      name: formValue.Name,
      description: formValue.Description,
      tags: formValue.Tags,
      level: 1,
      authorId: 1
    }

    console.log(tour)

    // if(this.author?.role === 'author'){
        this.sendCreateTourRequest(tour);
        // console.log("ALOOOOO")
    // }
    // else{
    //   alert("You don't have permission")
    // }
  }
  sendCreateTourRequest(tour : Tour): void{
    this.tourAuthorinService.addTour(tour).subscribe({
      next: (response) => {
        console.log('Tour added successfully:', response);
      },
      error: (error) => {
        console.error('Error adding tour:', error);
      },
    });
    // this.closeDialog();
  }

  getErrorMessage(controlName: string): string {
    const control: AbstractControl | null = this.form.get(controlName);
    if(control === null)
      return '';
    if (control.hasError('required')) {
      return `${controlName} is required`;
    }
    return ''; 
  }

  // closeDialog(): void {
  //   this.dialogRef.close();
  // }
}
