import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EquipmentFormComponent } from './equipment-form/equipment-form.component';
import { EquipmentComponent } from './equipment/equipment.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AccountsComponent } from './accounts/accounts.component';
import { MatTableModule } from '@angular/material/table';
import { AppRatingComponent } from './app-rating/app-rating.component';


@NgModule({
  declarations: [
    EquipmentFormComponent,
    EquipmentComponent,
    AccountsComponent,
    AppRatingComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    MatTableModule,
  ],
  exports: [
    EquipmentComponent,
    EquipmentFormComponent,
    AccountsComponent,
    MatTableModule,
    AppRatingComponent
  ]
})
export class AdministrationModule { }
