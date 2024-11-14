import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EquipmentManagementComponent } from './equipment-management/equipment-management.component';
import { ExecuteTourComponent } from './execute-tour/execute-tour.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { MatGridListModule } from '@angular/material/grid-list';
import { CompletedKeyPointDetailsComponent } from './completed-key-point-details/completed-key-point-details.component';
import { MatCardModule } from '@angular/material/card';


@NgModule({
  declarations: [
    EquipmentManagementComponent,
    ExecuteTourComponent,
    CompletedKeyPointDetailsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
    MatGridListModule,
    MatCardModule
  ],
  exports: [
    ExecuteTourComponent
  ]
})
export class TourExecutionModule { }
