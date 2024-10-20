import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Facility } from 'src/app/shared/model/facility';
import { FacilityService } from '../facility.service';

@Component({
  selector: 'xp-facility-dialog',
  templateUrl: './facility-dialog.component.html',
  styleUrls: ['./facility-dialog.component.css']
})
export class FacilityDialogComponent {
  form: FormGroup;
  facilityTypes: string[] = ['Wc', 'Restaurant', 'Parking', 'Other'];
  selectedFile: File;
  fileName: string = '';

  constructor(
    public dialogRef: MatDialogRef<FacilityDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { longitude: number, latitude: number },
    private formBuiilder: FormBuilder,
    private facilityService: FacilityService
  ) {
    this.form = this.formBuiilder.group({
      Name: ['', Validators.required],  
      Description: ['', Validators.required],
      Type: ['', Validators.required] ,
      Longitude: [this.data.longitude,Validators.required],
      Latitude: [this.data.latitude, Validators.required],
    });
  }

  submitForm(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched()
      return;
    }
    const formValue = this.form.value;
    
    let facility: Facility = {
      name: formValue.Name,
      description: formValue.Description,
      longitude: formValue.Longitude,
      latitude: formValue.Latitude,
      type: formValue.Type
    }

    if(this.selectedFile){
      this.convertFileToBase64(this.selectedFile)
        .then((base64String) => {
          facility.image = base64String;
          this.sendCreateFacilityRequest(facility);
        })
        .catch((error) => {
          console.error('Error converting file to Base64:', error);
        });
    }
    else{
      this.sendCreateFacilityRequest(facility);
    }
  }

  sendCreateFacilityRequest(facility: Facility): void{
    this.facilityService.addFacility(facility).subscribe({
      next: (response) => {
        console.log('Facility added successfully:', response);
      },
      error: (error) => {
        console.error('Error adding facility:', error);
      },
    });
    this.closeDialog();
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.fileName = this.selectedFile.name;
    }
  }

  convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
      };
      reader.onerror = (error) => {
        reject(error);
      };
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
}
