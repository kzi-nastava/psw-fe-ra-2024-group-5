export interface ClubMessage{
    id?: number,
    senderId: number,
    clubId: number,
    sentAt: string,
    content: String,
    isRead: boolean,
    attachment?: string | null
}