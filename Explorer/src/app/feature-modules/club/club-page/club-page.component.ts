import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClubService } from '../club.service';
import { UserProfileService } from '../../administration/user-profile.service';
import { Club } from '../model/club.model';
import { ClubMessage } from '../model/clubMessage.model';
import { TokenStorage } from '../../../infrastructure/auth/jwt/token.service';
import { UserProfile } from '../../administration/model/userProfile.model';
import { ResourceType } from '../enum/resource-type.enum';
import { Notification } from '../../notification/model/notification.model';
import { NotificationService } from '../../notification/notification.service';
import { NotificationReadStatus } from '../../notification/model/notification-read-status.model';
import { NotificationType } from '../../notification/enum/notification-type.enum';

@Component({
  selector: 'xp-club-page',
  templateUrl: './club-page.component.html',
  styleUrls: ['./club-page.component.css']
})
export class ClubPageComponent implements OnInit {
  club: Club | null = null;
  loading: boolean = true;
  clubId: number | null = null;
  userId: number | null = null;
  newMessage: string = '';
  clubMessages: ClubMessage[] = [];
  currentPage: number = 1;
  pageSize: number = 10;
  totalMessages: number = 0;
  users: { [key: number]: string } = {};
  isMessageTooLong: boolean = false;
  // za modalni prozor:
  editingMessageId: number | null = null;
  editedMessageContent: string = '';
  isEditedMessageTooLong: boolean = false;
  attachmentLink: string = '';
  resourceType: ResourceType = ResourceType.TOUR_RESOURCE;
  messageForDeleting: ClubMessage;

  constructor(private route: ActivatedRoute,
    private clubService: ClubService,
    private userProfileService: UserProfileService,
    private tokenStorage: TokenStorage,
    private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.clubId = +this.route.snapshot.paramMap.get('id')!;
    this.userId = this.tokenStorage.getUserId();

    if (this.clubId !== null) {
      this.clubService.getById(this.clubId).subscribe(
        (club) => {
          this.club = club;
          this.loading = false;
          this.loadMessages();
        },
        (error) => {
          console.error('Error fetching club data', error);
          this.loading = false;
        }
      );
    }
  }

  loadMessages(): void {
    if (this.clubId) {
      this.clubService.getPagedMessagesByClubId(this.clubId, this.currentPage, this.pageSize).subscribe(
        (response) => {
          this.clubMessages = response.results;   
          this.totalMessages = response.totalCount;  
          this.clubMessages.forEach(message => { 
            this.loadUserName(message.senderId);
          });
        },
        (error) => {
          if (this.clubId)
          console.log(this.clubService.getPagedMessagesByClubId(this.clubId, this.currentPage, this.pageSize));
          console.error('Error fetching messages', error);
        }
      );
    }
  }

  addMessage(): void {
    if (!this.newMessage || !this.clubId || this.userId == null || this.newMessage.length > 280)
      return;
  
    let attachmentData = null;
  
    if (this.attachmentLink) {
      const resourceData = this.parseAttachmentLink(this.attachmentLink);
      if (resourceData) {
        attachmentData = {
          resourceId: resourceData.resourceId,
          resourceType: resourceData.resourceType
        };
      }
    }
  
    const messageDto: ClubMessage = {
      senderId: this.userId,   
      clubId: this.clubId,
      sentAt: new Date().toISOString(),
      content: this.newMessage,
      isRead: false,
      attachment: attachmentData || null   
    };
  
    this.clubService.addMessageToClub(this.clubId, messageDto, this.userId).subscribe(
      (response) => { 
        this.loadMessages();
        this.newMessage = ''; 
        this.attachmentLink = '';  
        this.sendNotificationForAddingMessage(messageDto);
      },
      (error) => {
        console.error('Error adding message', error);
      }
    );
  }
  

changePage(page: number): void {
  this.currentPage = page;
  this.loadMessages();  
}

onMessageChange(event: any): void {
  this.newMessage = event.target.value;  
  const messageLength = this.newMessage.length;
  this.isMessageTooLong = messageLength > 280;
}

  loadUserName(userId: number): void {
    if (!this.users[userId]) {
      this.userProfileService.getUserProfile(+userId).subscribe({
        next: (result: UserProfile) => {
          this.users[userId] = `${result.name} ${result.surname}`;

        },
        error: (err: any) => {
          console.log(err);
        }
      });
    } else {
      console.error("User ID is null");
    }
  }

  editMessage(message: any): void {
    this.editingMessageId = message.id;
    this.editedMessageContent = message.content;  
    this.isEditedMessageTooLong = this.editedMessageContent.length > 280; 
  }

  saveEditedMessage(): void {
    if (this.editingMessageId !== null && this.editedMessageContent.trim().length > 0 && this.editedMessageContent.length <= 280) {
      const messageWithQuotes = `"${this.editedMessageContent}"`;
  
      this.clubService.updateMessageInClub(
        this.clubId!, 
        this.editingMessageId, 
        this.userId!, 
        messageWithQuotes
      ).subscribe({
        next: (updatedMessage) => {
          const index = this.clubMessages.findIndex(msg => msg.id === this.editingMessageId);
          if (index !== -1) {
            if (updatedMessage && updatedMessage.content) {
              this.clubMessages[index].content = updatedMessage.content;
            } else {
              console.error('Updated message is null or has no content.');
            }
          }
  
          this.closeModal();
          
          this.loadMessages();
        },
        error: (err) => {
          console.error('Error updating message', err);
        }
      });
    }
  }
  
  closeModal(): void {
    this.editingMessageId = null;
    this.editedMessageContent = '';
  }

  onEditedMessageChange(event: any): void {
    this.editedMessageContent = event.target.value;
    const messageLength = this.editedMessageContent.length;
    this.isEditedMessageTooLong = messageLength > 280;
  }

  deleteMessage(message: ClubMessage): void {
    this.messageForDeleting = message;
    const confirmation = window.confirm('Are you sure you want to delete this message?');
  
    if (confirmation && message.id) {
      this.clubService.removeMessageFromClub(this.clubId!, message.id, this.userId!).subscribe({
        next: () => {
          this.loadMessages();
          this.sendNotificationForDeletingMessage(this.messageForDeleting);
        },
        error: (err) => {
          console.error('Error deleting message', err);
        }
      });
    }
  }

  parseAttachmentLink(link: string) {
    const regex = /http:\/\/localhost:4200\/tour-detailed-view\/(\d+)/;
    const match = link.match(regex);
  
    if (match && match[1]) {
      return {
        resourceType: ResourceType.TOUR_RESOURCE,
        resourceId: Number(match[1])  
      };
    }
  
    return null;
  }
  
  sendNotificationForAddingMessage(messageDto: ClubMessage): void {
    this.clubService.getUserIdsByClubId(this.clubId!).subscribe({
      next: (userIds) => {
        let filteredUserIds = userIds.filter(userId => userId !== messageDto.senderId);
  
        if (this.club && this.club.ownerId && this.club.ownerId !== messageDto.senderId) {
          filteredUserIds = [...filteredUserIds, this.club.ownerId];
        }
  
        const newNotification: Notification = {
          userIds: filteredUserIds,
          content: "A new message was posted in the club!",
          createdAt: new Date().toISOString(),
          type: NotificationType.CLUB_MESSAGE,
          senderId: messageDto.senderId,
          clubId: messageDto.clubId,
          message: messageDto.content,
          profileMessageId: 0,
          clubMessageId: messageDto.clubId,
          attachment: messageDto.attachment || null,
          userReadStatuses: filteredUserIds.map(userId => ({
            userId: userId,
            NotificationId: 0,
            isRead: false
          }))
        };
  
        this.notificationService.sendNotification(newNotification).subscribe(
          (response) => {
            console.log('Notification sent successfully:', response);
          },
          (error) => {
            console.error('Error sending notification:', error);
          }
        );
      },
      error: (err) => {
        console.error('Error fetching user IDs for notification:', err);
      }
    });
  }

  public sendNotificationForDeletingMessage(messageForDeleting: ClubMessage) 
  {
    this.clubService.getUserIdsByClubId(this.clubId!).subscribe({
      next: (userIds) => {
        const newNotification: Notification = {
          userIds: [messageForDeleting.senderId],
          content: "Your message was deleted from club!",
          createdAt: new Date().toISOString(),
          type: NotificationType.CLUB_ACTIVITY,
          senderId: 0,
          clubId: messageForDeleting.clubId,
          message: messageForDeleting.content,
          profileMessageId: 0,
          clubMessageId: messageForDeleting.id,
          attachment: messageForDeleting.attachment || null,
          userReadStatuses: userIds.map(userId => ({
            userId: userId,
            NotificationId: 0,
            isRead: false
          }))
        };
  
        this.notificationService.sendNotification(newNotification).subscribe(
          (response) => {
            console.log('Notification sent successfully:', response);
          },
          (error) => {
            console.error('Error sending notification:', error);
          }
        );
      },
      error: (err) => {
        console.error('Error fetching user IDs for notification:', err);
      }
    });
  }
  
}
