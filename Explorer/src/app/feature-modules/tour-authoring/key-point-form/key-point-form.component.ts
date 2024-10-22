import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { KeyPoint } from '../model/key-point.model';
import { Validators } from '@angular/forms';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'xp-key-point-form',
  templateUrl: './key-point-form.component.html',
  styleUrls: ['./key-point-form.component.css']
})
export class KeyPointFormComponent {
  keyPointForm: FormGroup;
  keyPoint: KeyPoint;
  imagePreview: string | null = null;

  constructor(private fb: FormBuilder) {
    this.keyPoint = {
      name: '',
      description: '',
      image: '',
    };
    this.keyPointForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.maxLength(256)]],
      image: ['' , [Validators.required]],
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
      console.log('Base64 string:', base64String);
    };

    reader.onerror = (error) => {
      console.error('Error reading file:', error);
    };

    reader.readAsDataURL(file);
  }

  onSubmit() : void {
    if (this.keyPointForm.valid) {
      this.keyPoint = this.keyPointForm.value;
      console.log('Form Submitted:', this.keyPoint);
    }else{
      console.log(this.keyPointForm.controls['image'])
    }
  }
}
