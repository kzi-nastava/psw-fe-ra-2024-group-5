export interface Blog {
    id: number,
    title: string,
    description: string,
    status: number,
    createdDate: string,
    imageData?: {
        base64Data: string;
        contentType: string;
    }[]; 
}