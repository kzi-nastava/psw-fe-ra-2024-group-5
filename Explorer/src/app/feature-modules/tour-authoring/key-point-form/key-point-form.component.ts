import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { KeyPoint } from '../model/key-point.model';
import { Validators } from '@angular/forms';
import { AbstractControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { KeyPointsComponent } from '../key-points/key-points.component';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';

@Component({
  selector: 'xp-key-point-form',
  templateUrl: './key-point-form.component.html',
  styleUrls: ['./key-point-form.component.css']
})
export class KeyPointFormComponent {
  keyPointForm: FormGroup;
  keyPoint: KeyPoint = {
    name: '',
    description: ''
  };
  imagePreview: string | null = null;

  constructor(private fb: FormBuilder,
              public dialogRef: MatDialogRef<KeyPointsComponent>,
              @Inject(MAT_DIALOG_DATA) public data: {latitude: number, longitude: number}
  ) {
    this.keyPointForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.maxLength(256)]],
      image: ['' , [Validators.required]],
      latitude: data.latitude,
      longitude: data.longitude
    });

  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.convertToBase64(file);
    }
  }

  private convertToBase64(file: File): void {
    const reader = new FileReader();

    reader.onload = () => {
      const base64String = reader.result as string;
      this.imagePreview = base64String;
      this.keyPointForm.patchValue({ image: base64String.split(',')[1] });
      //console.log('Base64 string:', base64String);
    };

    reader.onerror = (error) => {
      console.error('Error reading file:', error);
    };

    reader.readAsDataURL(file);
  }

  cancel(): void{
    this.dialogRef.close(null);
  }

  onSubmit() : void {
    this.keyPoint = this.keyPointForm.value;
    this.dialogRef.close(this.keyPoint);
  }
}
