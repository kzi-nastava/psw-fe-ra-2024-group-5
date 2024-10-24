import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClubComponent } from './club/club.component';
import { FormsModule } from '@angular/forms'; // Import FormsModule


@NgModule({
  declarations: [
    ClubComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    ClubComponent
  ]
})
export class ClubModule { }
