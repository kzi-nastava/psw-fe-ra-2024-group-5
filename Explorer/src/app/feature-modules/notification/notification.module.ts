import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationComponent } from './notification/notification.component';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';  
import { MatIconModule } from '@angular/material/icon';  
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    NotificationComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatListModule,
    MatIconModule,
    RouterModule
  ],
  exports: [
    NotificationComponent
  ]
})
export class NotificationModule { }
