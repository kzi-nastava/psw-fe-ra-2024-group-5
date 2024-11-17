import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EncounterComponent } from './encounter/encounter.component';
import { EncountersManagingComponent } from './encounters-managing/encounters-managing.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    EncounterComponent,
    EncountersManagingComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule
  ],
  exports: [
    EncounterComponent,
    EncountersManagingComponent
  ]
})
export class EncounterModule { }
