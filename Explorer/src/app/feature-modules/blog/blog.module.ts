import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogComponent } from './blog-post/blog.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { BlogFormComponent } from './blog-form/blog-form.component';


@NgModule({
  declarations: [
    BlogComponent,
    BlogFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
  ],
  exports: [
    BlogComponent,
    BlogFormComponent
  ]
})
export class BlogModule { }
