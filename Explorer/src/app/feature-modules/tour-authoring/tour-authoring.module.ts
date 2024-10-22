import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TourComponent } from './tour/tour.component';
import { FacilityComponent } from './facility/facility.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { FacilityDialogComponent } from './facility-dialog/facility-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TourFormComponent } from './tour-form/tour-form.component';
import { TourCreationComponent } from './tour-creation/tour-creation.component';
import { TourEditComponent } from './tour-edit/tour-edit.component';
import { TourMapComponent } from './tour-map/tour-map.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    TourComponent,
    FacilityComponent,
    FacilityDialogComponent,
    TourFormComponent,
    TourCreationComponent,
    TourEditComponent,
    TourMapComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    SharedModule
  ],
  exports:[
    TourComponent,
  ]
})
export class TourAuthoringModule { }
