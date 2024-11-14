import { Component, Inject, OnInit } from '@angular/core';
import { ProfileMessage } from '../model/profile-message.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ResourceType } from '../../club/enum/resource-type.enum';
import { MessageService } from '../message.service';

@Component({
  selector: 'xp-send-message-dialog',
  templateUrl: './send-message-dialog.component.html',
  styleUrls: ['./send-message-dialog.component.css']
})
export class SendMessageDialogComponent implements OnInit {

  RESOURCE_TYPES = { blog: ResourceType.BLOG_RESOURCE, tour: ResourceType.TOUR_RESOURCE }

  message: ProfileMessage;

  attachmentLink: string;
  attachmentActive: boolean = false;

  constructor(
    private messageService: MessageService,
    public dialogRef: MatDialogRef<SendMessageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { senderId: number, recipientId: number },
  ) { }

  ngOnInit(): void {
    this.message = {
      senderId: this.data.senderId,
      recipientId: this.data.recipientId,
      content: '',
      attachment: null
    }
  }

  addAttachment(): void {
    this.attachmentActive = true;
    this.message.attachment = { resourceId: 0, resourceType: ResourceType.BLOG_RESOURCE }
  }

  removeAttachment(): void {
    this.attachmentActive = false;
    this.message.attachment = null;
  }

  sendMessage(): void {
    if (!this.message.recipientId || !this.message.senderId || this.message.content.length <= 0)
      return

    console.log(this.message)
    this.messageService.sendMessage(this.message).subscribe(
      (_) => { this.dialogRef.close() },
      (err) => { console.error(err) }
    )
  }

}
