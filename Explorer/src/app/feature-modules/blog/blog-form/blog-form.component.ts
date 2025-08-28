import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BlogService } from '../blog.service';
import { Router } from '@angular/router';
import { createBlog } from '../model/createBlog.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { imageData } from '../model/imageData.model';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'xp-blog-form',
  templateUrl: './blog-form.component.html',
  styleUrls: ['./blog-form.component.css']
})
export class BlogFormComponent {
  blogForm: FormGroup;
  selectedImages: imageData[] = [];
  contentType: string | null = null;
  isSubmitting = false;
  errorMessage: string | null = null;

  @ViewChild('carouselInner', { static: false }) carouselInner!: ElementRef;


  // Added for carousel
  currentImageIndex = 0;

  constructor(
    private fb: FormBuilder,
    private blogService: BlogService, 
    private router: Router, 
    private authService: AuthService,
    private dialogRef: MatDialogRef<BlogFormComponent>
  ) {
    this.blogForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      image: [null]
    });
  }

  updateCarousel(): void {
    if (this.carouselInner) {
      const offset = -this.currentImageIndex * 100;
      this.carouselInner.nativeElement.style.transform = `translateX(${offset}%)`;
    }
  }


  onImageSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      const files = Array.from(fileInput.files);
  
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          const img = new Image();
          img.src = reader.result as string;
  
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d')!;
            const maxWidth = 400; // Maksimalna širina slike
            const maxHeight = 250; // Maksimalna visina slike
  
            // Proporcionalno skaliranje
            let width = img.width;
            let height = img.height;
  
            if (width > height) {
              if (width > maxWidth) {
                height *= maxWidth / width;
                width = maxWidth;
              }
            } else {
              if (height > maxHeight) {
                width *= maxHeight / height;
                height = maxHeight;
              }
            }
  
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);
  
            // Generisanje base64 stringa za skaliranu sliku
            const resizedImage = canvas.toDataURL(file.type);
  
            this.selectedImages.push({
              base64Data: resizedImage.split(',')[1],
              contentType: file.type,
            });
          };
        };
        reader.readAsDataURL(file);
      });
    }
  }
  

  removeImage(index: number): void {
    this.selectedImages.splice(index, 1);
    // Adjust the current index if needed
    if (this.currentImageIndex >= this.selectedImages.length) {
      this.currentImageIndex = Math.max(this.selectedImages.length - 1, 0);
    }
    this.updateCarousel();
  }

  nextiImage(): void {
    if (this.currentImageIndex < this.selectedImages.length - 1) {
      this.currentImageIndex++;
    } else {
      this.currentImageIndex = 0;
    }
    this.updateCarousel();
  }

  previImage(): void {
    if (this.currentImageIndex > 0) {
      this.currentImageIndex--;
    } else {
      this.currentImageIndex = this.selectedImages.length - 1;
    }
    this.updateCarousel();
  }

 

  onSubmit(): void {
    if (this.blogForm.invalid || this.isSubmitting) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }

    const formValues = this.blogForm.value;

    this.authService.user$.subscribe(user => {
      if (user) {
        const userId = user.id;

        const newBlog: createBlog = {
          userId: userId,
          title: formValues.title,
          description: formValues.description,
          images: this.selectedImages.map(img => ({
            base64Data: img.base64Data,
            contentType: img.contentType
          }))
        };

        this.isSubmitting = true;
        this.blogService.createBlog(newBlog).subscribe({
          next: () => {
            this.isSubmitting = false;
            this.dialogRef.close('created');
          },
          error: (err: any) => {
            this.isSubmitting = false;
            this.errorMessage = 'Failed to create blog: ' + err.errorMessage;
          }
        });
      } else {
        console.error('User is not logged in.');
      }
    });
  }
}


