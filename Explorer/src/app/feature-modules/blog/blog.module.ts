import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogPostCommentComponent } from './blog-post-comment/blog-post-comment.component';
import { BlogPostCommentFormComponent } from './blog-post-comment-form/blog-post-comment-form.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { BlogComponent } from './blog-post/blog.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { BlogFormComponent } from './blog-form/blog-form.component';


@NgModule({
  declarations: [
    BlogPostCommentComponent,
    BlogPostCommentFormComponent,
    BlogComponent,
    BlogFormComponent
  ],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MaterialModule,
  ], 
  exports: [
    BlogPostCommentComponent,
    BlogComponent,
    BlogFormComponent
  ]
  
})
export class BlogModule { }
