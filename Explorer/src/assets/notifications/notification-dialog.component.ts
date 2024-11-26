// notification-dialog.component.ts
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'xp-notification-dialog',
  template: `
    <div class="notification-content">
      <p>{{ data.message }}</p>
    </div>
  `,
  styles: [`
    .notification-content {
      padding: 20px;
      text-align: center;
      min-width: 250px;
    }
    p {
      margin: 0;
      font-size: 16px;
    }
  `]
})
export class NotificationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<NotificationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string }
  ) {
    // Auto close after 3 seconds
    setTimeout(() => {
      this.dialogRef.close();
    }, 3000);
  }
}