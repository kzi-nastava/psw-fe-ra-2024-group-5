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
import { AppRatingComponent } from './app-rating/app-rating.component';
import { FollowersListComponent } from './followers-list/followers-list.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { SendMessageDialogComponent } from './send-message-dialog/send-message-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';



@NgModule({
  declarations: [
    EquipmentFormComponent,
    EquipmentComponent,
    AppRatingComponent,
    UserProfileComponent,
    UserProfileFormComponent,
    AccountsComponent,
    FollowersListComponent,
    SendMessageDialogComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatSelectModule
  ],
  exports: [
    EquipmentComponent,
    EquipmentFormComponent,
    UserProfileComponent,
    AccountsComponent,
    MatTableModule,
    AppRatingComponent,
    FollowersListComponent
  ]
})
export class AdministrationModule { }
