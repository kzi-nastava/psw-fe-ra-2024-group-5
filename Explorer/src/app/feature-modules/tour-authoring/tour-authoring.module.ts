import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TourComponent } from './tour/tour.component';
import { FacilityComponent } from './facility/facility.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { FacilityDialogComponent } from './facility-dialog/facility-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    TourComponent,
    FacilityComponent,
    FacilityDialogComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
  ],
  exports:[
    TourComponent
  ]
})
export class TourAuthoringModule { }
