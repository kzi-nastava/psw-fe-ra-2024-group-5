export interface UserProfile {
    id: number,
    userId: number,
    name: string,
    surname: string,
    profileImage?: string,
    biography?: string,
    motto?: string
    // messages?: ProfileMessage[]; dodati kad se napravi ProfileMessage
}