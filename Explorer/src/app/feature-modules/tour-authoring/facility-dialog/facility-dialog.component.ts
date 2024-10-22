import { Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Facility } from 'src/app/shared/model/facility';
import { FacilityService } from '../facility.service';
import { MapService } from 'src/app/shared/map/map.service';
import { MapComponent } from 'src/app/shared/map/map.component';

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
  mapFacilities: Facility[] = [];
  title: string = 'Add a new facility';
  @ViewChild(MapComponent) mapComponent!: MapComponent;

  constructor(
    public dialogRef: MatDialogRef<FacilityDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { selectedFacility: Facility | null },
    private formBuiilder: FormBuilder,
    private facilityService: FacilityService,
    private mapService: MapService
  ) {

    this.form = this.formBuiilder.group({
      Name: ['', Validators.required],  
      Description: ['', Validators.required],
      Type: ['', Validators.required] ,
      Longitude: ['',Validators.required],
      Latitude: ['', Validators.required],
      Location: ['', Validators.required],
    });

    if(data.selectedFacility){
      this.title = 'Update existing facility';
      const long = data.selectedFacility.longitude;
      const lat = data.selectedFacility.latitude;

      this.form.patchValue({
        Name: data.selectedFacility.name,
        Description: data.selectedFacility.description,
        Type: data.selectedFacility.type,
        Longitude: long,
        Latitude: lat
      });

      this.mapService.reverseSearch(lat, long).subscribe((res) => {
        this.form.patchValue({
          Location: res.display_name
        })
      });
      
      this.mapFacilities.push(data.selectedFacility)
    }
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

    if(this.data.selectedFacility)
      facility.image = this.data.selectedFacility.image;

    if(this.selectedFile){
      this.convertFileToBase64(this.selectedFile)
        .then((base64String) => {
          facility.image = base64String;
          
          this.sendRequest(facility);
        })
        .catch((error) => {
          console.error('Error converting file to Base64:', error);
        });
    }
    else{
      this.sendRequest(facility);
    }
  }

  changeLongLat(latLong: number[]): void{
    const [lat,long] = latLong;

    this.mapService.reverseSearch(lat, long).subscribe((res) => {
      this.form.patchValue({
        Location: res.display_name,
        Longitude: long,
        Latitude: lat
      })
    });
  }

  saveLocation(): void{
    const location = this.form.value.Location
    if(!location)
      return;
    
    this.mapService.search(location).subscribe((res) => {
      if(res.length == 0){
        this.form.patchValue({
          Location: ''
        });
        this.form.controls['Location'].markAsTouched();
      }
      else{
        this.mapComponent.search(location)
        this.form.patchValue({
          Longitude: res[0].lon,
          Latitude: res[0].lat
        });
      }
    });  
  }

  sendRequest(facility: Facility):void{
    if(!this.data.selectedFacility)
      this.sendCreateFacilityRequest(facility);
    else
      this.sendUpdateFacilityRequest(facility);
  }

  sendUpdateFacilityRequest(facility: Facility):void{
    facility.id = this.data.selectedFacility?.id;
    this.facilityService.updateFacility(facility).subscribe({
      next: (response) => {
        console.log('Facility update successfully:', response);
      },
      error: (error) => {
        console.error('Error update facility:', error);
      },
    });

    this.dialogRef.close(true);
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

    this.dialogRef.close(true);
  }

  closeDialog(): void {
    this.dialogRef.close(false);
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
