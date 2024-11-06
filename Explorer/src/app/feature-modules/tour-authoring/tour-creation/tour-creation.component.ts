import { Component, OnInit, ViewChild } from '@angular/core';
import { TourAuthoringService } from '../tour-authoring.service';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Tour, TourCreation, TransportDuration } from '../model/tour.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { KeyPointsComponent } from '../key-points/key-points.component';
import { MapComponent } from 'src/app/shared/map/map.component';
import { TourLevel, Currency, TourTransport } from '../model/tour.enums'; // Import the enums

@Component({
  selector: 'xp-tour-creation',
  templateUrl: './tour-creation.component.html',
  styleUrls: ['./tour-creation.component.css']
})
export class TourCreationComponent {
  form: FormGroup;
  tourLevels: string[] = ['Beginner', 'Intermediate', 'Advanced'];
  tourTransports: string[] = ['On Foot', 'Bicycle', 'Car']; // Only the string representations
  tourLength: number | 0;
  tourTransportDurations : TransportDuration[] = [];
  author: User | undefined;
  coordinates: number[] | null = null;
  @ViewChild(KeyPointsComponent) keyPointsListComponent!: KeyPointsComponent;
  @ViewChild(MapComponent) map: MapComponent;


  constructor(
    private formBuilder: FormBuilder,
    private tourAuthoringService: TourAuthoringService,
    private authService: AuthService,
    private router: Router
  ) {
    this.resetForm();
  }

  sendCordinates(latlng: number[]) {
    this.coordinates = latlng
    console.log('Coordinates received in main component');
    console.log(this.coordinates);
  }

  setTourLength(length: number){
    this.tourLength = length
    console.log(this.tourLength)
  }

  setTransportDuration(data: { profile: string; time: number; }){

    switch(data.profile){
      case 'walking':
        var td : TransportDuration = {duration: data.time, transport: TourTransport.OnFoot}
        this.tourTransportDurations.push(td)
        break;
      case 'cycling':
        var td : TransportDuration = {duration: data.time, transport: TourTransport.Bicycle}
        this.tourTransportDurations.push(td)
        break;
      case 'driving':
        var td : TransportDuration = {duration: data.time, transport: TourTransport.Car}
        this.tourTransportDurations.push(td)
        break;
      default:
        return;
    }
  }

  cancelKeyPoint(latlng: number[]) {
    if(!latlng){
      this.map.removeLastMarker();
    }else{
      this.map.removeExactMarker(latlng);
    }
  }

  submitForm(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
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


    let transportValue: number | undefined;
    switch (formValue.Transport) {
      case 'On Foot':
        transportValue = 0;
        break;
      case 'Bicycle':
        transportValue = 1;
        break;
      case 'Car':
        transportValue = 2;
        break;
      default:
        console.error('Invalid transportation selected');
        return; // Early exit on invalid level
    }

    let tour: TourCreation = {
      name: formValue.Name,
      description: formValue.Description,
      tags: formValue.Tags,
      level: levelValue,
      authorId: this.author?.id,
      length: this.tourLength,
      keyPoints: this.keyPointsListComponent.getKeyPoints(), // This should be populated based on key points
      transportDurationDtos: this.tourTransportDurations, // Use selected transport
      
    };

    console.log(tour);

    if (this.author?.role === 'author') {
      this.sendCreateTourRequest(tour);
    } else {
      alert("You don't have permission");
    }
  }

  sendCreateTourRequest(tour: TourCreation): void {
    this.tourAuthoringService.addTour(tour).subscribe({
      next: (response) => {
        console.log('Tour added successfully:', response);
        if (response.id) {
          this.keyPointsListComponent.resetkeyPoints();
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
    if (control === null)
      return '';
    if (control.hasError('required')) {
      return `${controlName} is required`;
    }
    return '';
  }

  resetForm(): void {
    this.form = this.formBuilder.group({
      Name: ['', Validators.required],
      Description: ['', Validators.required],
      Tags: ['', Validators.required],
      Level: ['', Validators.required],
      TransportDuration: ['', [Validators.required, Validators.min(0)]],
      Transport: ['', Validators.required]
    });
  }

  back(): void {
    this.router.navigate(['/tour']);
  }
}
