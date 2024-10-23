import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FacilityComponent } from './facility/facility.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { FacilityDialogComponent } from './facility-dialog/facility-dialog.component';
import { TourEquipmentDialogComponent } from './tour-equipment-dialog/tour-equipment-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TourMapComponent } from './tour-map/tour-map.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    FacilityComponent,
    FacilityDialogComponent,
    TourEquipmentDialogComponent,
    TourMapComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    SharedModule
  ]
})
export class TourAuthoringModule { }
