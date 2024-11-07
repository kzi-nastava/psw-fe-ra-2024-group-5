import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClubService } from '../club.service';
import { UserProfileService } from '../../administration/user-profile.service';
import { Club } from '../model/club.model';
import { ClubMessage } from '../model/clubMessage.model';
import { TokenStorage } from '../../../infrastructure/auth/jwt/token.service';
import { UserProfile } from '../../administration/model/userProfile.model';

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

  constructor(private route: ActivatedRoute,
    private clubService: ClubService,
    private userProfileService: UserProfileService,
    private tokenStorage: TokenStorage,) {}

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

    const messageDto = {
      senderId: this.userId,   
      clubId: this.clubId,
      sentAt: new Date().toISOString(),
      content: this.newMessage,
      isRead: false ,
      attachment: null  
    };

    this.clubService.addMessageToClub(this.clubId, messageDto, this.userId).subscribe(
      (response) => { 
        this.loadMessages();
        this.newMessage = '';   
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
    const confirmation = window.confirm('Are you sure you want to delete this message?');
  
    if (confirmation && message.id) {
      this.clubService.removeMessageFromClub(this.clubId!, message.id, this.userId!).subscribe({
        next: () => {
          this.loadMessages();
        },
        error: (err) => {
          console.error('Error deleting message', err);
        }
      });
    }
  }
  
}
