import { KeyPoint } from "./key-point.model";

export interface PublishedTour {
    id?: number;
    name: string;
    description: string;
    tags: string;
    level: number; 
    status: number; 
    price: {amount: number, currency: number};
    authorId?: number;
    keyPoints: KeyPoint[]; 
    transport: number;
    length: number;
    duration: number;
    publishedTime: Date;
    archivedTime?: Date;
}


