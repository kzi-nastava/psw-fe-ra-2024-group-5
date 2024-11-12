import { Component, Inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
//import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TourAuthoringService } from '../tour-authoring.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { Tour } from '../model/tour.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';

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
    private tourAuthorinService: TourAuthoringService,
    private authService: AuthService
  ){
    this.resetForm();
  }

  // submitForm(): void {
  //   if (!this.form.valid) {
  //     this.form.markAllAsTouched()
  //     return;
  //   }
  //   this.authService.user$.subscribe(user => {
  //     this.author = user;
  //   });
  //   const formValue = this.form.value;
  // let levelValue: number | undefined;

  // switch (formValue.Level) {
  //   case 'Beginner': 
  //     levelValue = 0; 
  //     break;
      
  //   case 'Intermediate': 
  //     levelValue = 1; 
  //     break;
      
  //   case 'Advanced': 
  //     levelValue = 2; 
  //     break;

  //   default:
  //     console.error('Invalid level selected');
  //     return; // Early exit on invalid level
  // }

  // let tour: Tour = {
  //   name: formValue.Name,
  //   description: formValue.Description,
  //   tags: formValue.Tags,
  //   level: levelValue,
  //   authorId: this.author?.id
  // };

  //   console.log(tour)

  //   if(this.author?.role === 'author'){
  //       this.sendCreateTourRequest(tour);
  //   }
  //   else{
  //     alert("You don't have permission")
  //   }
  // }
  sendCreateTourRequest(tour : Tour): void{
    this.tourAuthorinService.addTour(tour).subscribe({
      next: (response) => {
        console.log('Tour added successfully:', response);
        this.resetForm();
      },
      error: (error) => {
        console.error('Error adding tour:', error);
      },
    });
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

  resetForm() :void{
    this.form = this.formBuilder.group({
      Name: ['', Validators.required],
      Description: ['', Validators.required],
      Tags: ['', Validators.required],
      Level: ['', Validators.required]
    });
  }
}
