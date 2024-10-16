import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FacilityComponent } from './facility/facility.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';



@NgModule({
  declarations: [
    FacilityComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ]
})
export class TourAuthoringModule { }
