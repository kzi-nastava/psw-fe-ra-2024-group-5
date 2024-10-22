export interface UserProfile {
    id: number,
    userId: number,
    name: string,
    surname: string,
    profilePictureUrl?: string,
    biography?: string,
    motto?: string
}