export interface Tour{
    id?: number,
    name: string,
    description: string,
    tags: string,
    level: number,
    status?: number,
    price?: number,
    authorId?: number
}