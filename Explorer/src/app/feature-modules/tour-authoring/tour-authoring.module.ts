import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TourComponent } from './tour/tour.component';
import { FacilityComponent } from './facility/facility.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { FacilityDialogComponent } from './facility-dialog/facility-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TourFormComponent } from './tour-form/tour-form.component';
import { TourCreationComponent } from './tour-creation/tour-creation.component';


@NgModule({
  declarations: [
    TourComponent,
    FacilityComponent,
    FacilityDialogComponent,
    TourFormComponent,
    TourCreationComponent
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
