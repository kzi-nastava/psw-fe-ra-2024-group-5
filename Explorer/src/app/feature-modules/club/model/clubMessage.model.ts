import { Attachment } from '../model/attachment.model';

export interface ClubMessage{
    id?: number,
    senderId: number,
    clubId: number,
    sentAt: string,
    content: String,
    isRead: boolean,
    attachment?: Attachment | null
}