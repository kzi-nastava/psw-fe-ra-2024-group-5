import { Component, OnInit, ViewChild } from '@angular/core';
import { TourAuthoringService } from '../tour-authoring.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Tour } from '../model/tour.model';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { KeyPoint } from '../model/key-point.model';
import { MapComponent } from 'src/app/shared/map/map.component';

@Component({
  selector: 'xp-tour-edit',
  templateUrl: './tour-edit.component.html',
  styleUrls: ['./tour-edit.component.css']
})
export class TourEditComponent implements OnInit{

  isEditable : boolean = false;
  user : User | undefined
  tour : Tour | undefined;
  tourId: number;
  form:FormGroup;
  tourLevels:string[]= ['Beginner', 'Intermediate', 'Advanced'];
  tourStatus:string[]= ['Draft', 'Active', 'Finished', 'Canceled'];
  @ViewChild(MapComponent) map: MapComponent;

  constructor(
    private formBuilder: FormBuilder,
    private service: TourAuthoringService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ){
    this.resetForm();
  }
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('tourId'); // 'id' is the name used in the route definition
      this.tourId = Number(id)
      console.log(this.tourId)
    });
    this.authService.user$.subscribe(user => {
      this.user = user;
      this.service.getTourbyId(this.tourId).subscribe({
        next: (result: Tour) => {
          this.tour = result
          console.log(this.tour)
          this.setForm();
          console.log(this.form.value)
        },
        error: (err: any) => {
          console.log(err)
        }
      })
    });

  }
  submitForm(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched()
      return;
    }
    const formValue = this.form.value;
    const levelMapping: { [key: string]: number } = {
      'Beginner': 0,
      'Intermediate': 1,
      'Advanced': 2,
    };
    const statusMapping: {[key: string]: number}={
      'Draft': 0,
      'Active': 1,
      'Finished': 2,
      'Canceled': 3
    };
  const levelValue = levelMapping[formValue.Level];
  const statusValue = statusMapping[formValue.Status];

  let tour: Tour = {
    id: this.tour?.id,
    name: formValue.Name,
    description: formValue.Description,
    tags: formValue.Tags,
    level: levelValue,
    status: statusValue,
    price: formValue.Price,
    authorId: this.user?.id
  };


    console.log(tour)

    if(this.user?.role === 'author'){
        this.sendUpdateTourRequest(tour);
    }
    else{
      alert("You don't have permission")
    }
  }
  sendUpdateTourRequest(tour : Tour): void{
    this.service.updateTour(tour).subscribe({
      next: (response) => {
        console.log('Tour updated successfully:', response);
        this.tour = response;
        this.setForm();
      },
      error: (error) => {
        console.error('Error updating tour:', error);
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

  displayKeyPoints(keyPoints: KeyPoint[]){
    keyPoints.forEach(element => {
      this.map.addKeyPointMarker([element.latitude, element.longitude], element.name);
    });
  }

  resetForm() :void{
    this.form = this.formBuilder.group({
      Name: ['', Validators.required],
      Description: ['', Validators.required],
      Tags: ['', Validators.required],
      Level: [0, Validators.required],
      Status: [0, Validators.required],
      Price: [0, Validators.required],
      AuthorId: this.user?.id
    });
  }

  setForm(): void{
    const levelMapping: { [key: number]: string } = {
      0 : 'Beginner',
      1 : 'Intermediate',
      2 : 'Advanced'
    };
    const statusMapping: {[key: number]: string}={
      0 : 'Draft',
      1 : 'Active',
      2 : 'Finished',
      3 : 'Canceled'
    };
  const levelValue = levelMapping[this.tour?.level || 0];
  const statusValue = statusMapping[this.tour?.status || 0];
    this.form.patchValue({
      Name: this.tour?.name,
      Description: this.tour?.description,
      Tags: this.tour?.tags,
      Level: levelValue,
      Status: statusValue,
      Price: this.tour?.price,
      AuthorId: this.user?.id
    });
  }

  back():void{
    this.router.navigate(['/tour']);
  }

  changeEditable(): void {
    this.isEditable = !this.isEditable;
    console.log(this.isEditable)
    // this.toggleFormState(); // Update form state based on isEditable
  }

  private toggleFormState(): void {
    if (this.isEditable) {
      this.form.enable(); // Enable form if editable
    } else {
      this.form.disable(); // Disable form if not editable
    }
  }
}
