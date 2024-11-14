import { Attachment } from "./attachment.model";

export interface ProfileMessage {
    senderId: number,
    recipientId: number,
    content: string,
    attachment: Attachment | null
}