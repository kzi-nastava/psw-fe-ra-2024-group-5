import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EquipmentFormComponent } from './equipment-form/equipment-form.component';
import { EquipmentComponent } from './equipment/equipment.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserProfileFormComponent } from './user-profile-form/user-profile-form.component';
import { RouterModule } from '@angular/router';
import { AccountsComponent } from './accounts/accounts.component';
import { MatTableModule } from '@angular/material/table';
import { FollowersListComponent } from './followers-list/followers-list.component';


@NgModule({
  declarations: [
    EquipmentFormComponent,
    EquipmentComponent,
    UserProfileComponent,
    UserProfileFormComponent,
    AccountsComponent,
    FollowersListComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    RouterModule,
    MatTableModule
  ],
  exports: [
    EquipmentComponent,
    EquipmentFormComponent,
    UserProfileComponent,
    AccountsComponent,
    MatTableModule,
    FollowersListComponent
  ]
})
export class AdministrationModule { }
