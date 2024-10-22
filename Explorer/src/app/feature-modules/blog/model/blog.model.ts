import { imageData } from "./imageData.model";

export interface Blog {
    id: number,
    title: string,
    description: string,
    status: number,
    createdDate: string,
    imageData?: imageData[]; 
}