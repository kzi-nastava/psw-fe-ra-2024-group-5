import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogPostCommentComponent } from './blog-post-comment/blog-post-comment.component';



@NgModule({
  declarations: [
    BlogPostCommentComponent
  ],
  imports: [
    CommonModule
  ], 
  exports: [
    BlogPostCommentComponent
  ]
   
  
})
export class BlogModule { }
