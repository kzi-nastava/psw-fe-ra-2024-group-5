import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EquipmentFormComponent } from './equipment-form/equipment-form.component';
import { EquipmentComponent } from './equipment/equipment.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserProfileFormComponent } from './user-profile-form/user-profile-form.component';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    EquipmentFormComponent,
    EquipmentComponent,
    UserProfileComponent,
    UserProfileFormComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    RouterModule
  ],
  exports: [
    EquipmentComponent,
    EquipmentFormComponent,
    UserProfileComponent,
    
  ]
})
export class AdministrationModule { }
