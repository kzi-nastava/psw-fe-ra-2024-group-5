import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KeyPointsComponent } from './key-points/key-points.component';
import { KeyPointFormComponent } from './key-point-form/key-point-form.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';



@NgModule({
  declarations: [
    KeyPointsComponent,
    KeyPointFormComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [
    KeyPointsComponent,
    KeyPointFormComponent
  ]
})
export class TourAuthoringModule { }
