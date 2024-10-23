import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BlogService } from '../blog.service';
import { Router } from '@angular/router';
import { createBlog } from '../model/createBlog.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { imageData } from '../model/imageData.model';


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

  constructor(private fb: FormBuilder, private blogService: BlogService, private router: Router, private authService : AuthService){
    this.blogForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      image: [null]
    });
  }

  onImageSelected(event: Event): void{
    const files = (event.target as HTMLInputElement).files;
    if (files){
      for (let i = 0; i < files.length; i++){
        const file = files[i];
        const reader = new FileReader();

        reader.onload = () =>{
          const base64 = (reader.result as string).split(',')[1];
          this.selectedImages.push({
            base64Data: base64,
            contentType: file.type
          });
        };

        reader.readAsDataURL(file);
      }
    }
  }

  removeImage(index: number): void {
    this.selectedImages.splice(index, 1);
  }

  onSubmit(): void{
    if (this.blogForm.invalid){
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }

    const fromValues = this.blogForm.value;

    this.authService.user$.subscribe(user => {
      if (user && user.id){
        const userId = user.id;

        const newBlog: createBlog = {
          userId: userId,
          title: fromValues.title,
          description: fromValues.description,
          imageData: this.selectedImages.map(img => ({
            base64Data: img.base64Data,
            contentType: img.contentType
          }))
        };

        console.log(newBlog);
    
        this.isSubmitting = true;
        this.blogService.createBlog(newBlog).subscribe({
          next: () => {
            this.isSubmitting = false;
            this.router.navigate(['blog']);
          },
          error: (err: any) => {
            this.isSubmitting = false;
            this.errorMessage = 'Failed to create blog: ' + err.errorMessage;
          }
        });
      } else {
        console.error('User is not loged in.');
      }
    })
  }
}
