import { NotificationType } from '../enum/notification-type.enum';
import { Attachment } from '../../administration/model/attachment.model';
import { NotificationReadStatus } from './notification-read-status.model';

export interface Notification {
    id?: number,
    userIds: number[],
    content: String,
    createdAt: string,
    type: NotificationType,
    senderId?: number,
    profileMessageId?: number,
    clubMessageId?: number,
    clubId?: number,
    message?: String,
    attachment?: Attachment | null,
    userReadStatuses: NotificationReadStatus[]
}

