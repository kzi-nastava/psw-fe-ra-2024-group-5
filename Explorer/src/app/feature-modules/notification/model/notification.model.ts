import { NotificationType } from '../enum/notification-type.enum';

export interface Notification{
    id?: number,
    userId: number,
    content: string,
    isRead: boolean,
    createdAt: string,
    type: NotificationType,
    senderId?: number,
    profileMessageId?: number,
    clubMessageId?: number,
    clubId?: number,
    message?: string,
    attachment?: string // Attachment
}

