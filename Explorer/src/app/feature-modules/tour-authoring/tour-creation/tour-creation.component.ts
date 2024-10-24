import { Component, OnInit, SimpleChange, ViewChild } from '@angular/core';
import { TourAuthoringService } from '../tour-authoring.service';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Tour } from '../model/tour.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { KeyPointsComponent } from '../key-points/key-points.component';
import { MapComponent } from 'src/app/shared/map/map.component';

@Component({
  selector: 'xp-tour-creation',
  templateUrl: './tour-creation.component.html',
  styleUrls: ['./tour-creation.component.css']
})
export class TourCreationComponent{
  form:FormGroup;
  tourLevels:string[]= ['Beginner', 'Intermediate', 'Advanced'];
  author: User | undefined;
  coordinates: number[] | null = null;
  @ViewChild(KeyPointsComponent) keyPointsListComponent!: KeyPointsComponent;
  @ViewChild(MapComponent) map: MapComponent;

  constructor(
    private formBuilder: FormBuilder,
    private tourAuthorinService: TourAuthoringService,
    private authService: AuthService,
    private router: Router
  ){
    this.resetForm();
  }

  sendCoordinates(latLng: number[]){
    this.coordinates = latLng;
    console.log('primam koordinate u velikoj komp');
  }

  cancelKeyPoint(){
    this.map.removeLastMarker();
  }

  submitForm(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched()
      return;
    }
    this.authService.user$.subscribe(user => {
      this.author = user;
    });
    const formValue = this.form.value;
  let levelValue: number | undefined;

  switch (formValue.Level) {
    case 'Beginner': 
      levelValue = 0; 
      break;
      
    case 'Intermediate': 
      levelValue = 1; 
      break;
      
    case 'Advanced': 
      levelValue = 2; 
      break;

    default:
      console.error('Invalid level selected');
      return; // Early exit on invalid level
  }

  let tour: Tour = {
    name: formValue.Name,
    description: formValue.Description,
    tags: formValue.Tags,
    level: levelValue,
    authorId: this.author?.id
  };


    console.log(tour)

    if(this.author?.role === 'author'){
        this.sendCreateTourRequest(tour);
    }
    else{
      alert("You don't have permission")
    }
  }
  sendCreateTourRequest(tour : Tour): void{
    this.tourAuthorinService.addTour(tour).subscribe({
      next: (response) => {
        console.log('Tour added successfully:', response);
        if(response.id){
          this.keyPointsListComponent.saveKeyPoints(response.id);
          this.map.removeMarkers();
          this.map.removeRoute();
        }
          
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
  back():void{
    this.router.navigate(['/tour']);
  }
}
