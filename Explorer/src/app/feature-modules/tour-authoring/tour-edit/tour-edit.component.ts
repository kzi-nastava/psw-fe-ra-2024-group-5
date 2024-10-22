import { Component, OnInit } from '@angular/core';
import { TourAuthoringService } from '../tour-authoring.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Tour } from '../model/tour.model';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'xp-tour-edit',
  templateUrl: './tour-edit.component.html',
  styleUrls: ['./tour-edit.component.css']
})
export class TourEditComponent implements OnInit{

  user : User | undefined
  tour : Tour | undefined;
  tourId: number;
  form:FormGroup;
  tourLevels:string[]= ['Beginner', 'Intermediate', 'Advanced'];
  tourStatus:string[]= ['Draft', 'Active', 'Finished'];
  author: User | undefined;
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
    'Canceled': -1
  };
  const levelValue = levelMapping[formValue.Level];
  const statusValue = statusMapping[formValue.Status];

  let tour: Tour = {
    id: formValue.Id,
    name: formValue.Name,
    description: formValue.Description,
    tags: formValue.Tags,
    level: levelValue,
    status: statusValue,
    price: formValue.Price,
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
    this.service.addTour(tour).subscribe({
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
      Level: ['', Validators.required],
      Status: ['', Validators.required],
      Price: [-1, Validators.required],
      AuthorId: this.author?.id
    });
  }

  setForm(): void{
    this.form.patchValue({
      Name: this.tour?.name,
      Description: this.tour?.description,
      Tags: this.tour?.tags,
      Level: this.tour?.level,
      Status: this.tour?.status,
      Price: this.tour?.price,
      AuthorId: this.author?.id
    });
  }

  back():void{
    this.router.navigate(['/tour']);
  }
}
