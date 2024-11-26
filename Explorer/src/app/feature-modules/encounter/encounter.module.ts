import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EncounterComponent } from './encounter/encounter.component';
import { EncountersManagingComponent } from './encounters-managing/encounters-managing.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { EncounterDetailsComponent } from './encounter-details/encounter-details.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { EncountersApprovalComponent } from './encounters-approval/encounters-approval.component';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    EncounterComponent,
    EncountersManagingComponent,
    EncounterDetailsComponent,
    EncountersApprovalComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    RouterModule,
    MatIconModule
  ],
  exports: [
    EncounterComponent,
    EncountersManagingComponent,
    EncountersApprovalComponent
  ]
})
export class EncounterModule { }
