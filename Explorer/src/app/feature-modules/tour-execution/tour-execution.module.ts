import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EquipmentManagementComponent } from './equipment-management/equipment-management.component';
import { ExecuteTourComponent } from './execute-tour/execute-tour.component';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [
    EquipmentManagementComponent,
    ExecuteTourComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    ExecuteTourComponent
  ]
})
export class TourExecutionModule { }
