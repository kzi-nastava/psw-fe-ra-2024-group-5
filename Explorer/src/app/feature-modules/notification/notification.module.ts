import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationComponent } from './notification/notification.component';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';  
import { MatIconModule } from '@angular/material/icon';  

@NgModule({
  declarations: [
    NotificationComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatListModule,
    MatIconModule
  ],
  exports: [
    NotificationComponent
  ]
})
export class NotificationModule { }
