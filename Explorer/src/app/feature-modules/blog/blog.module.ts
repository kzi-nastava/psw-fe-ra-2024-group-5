import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogPostCommentComponent } from './blog-post-comment/blog-post-comment.component';
import { BlogPostCommentFormComponent } from './blog-post-comment-form/blog-post-comment-form.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';


@NgModule({
  declarations: [
    BlogPostCommentComponent,
    BlogPostCommentFormComponent
  ],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule

  ], 
  exports: [
    BlogPostCommentComponent
  ]
   
  
})
export class BlogModule { }
