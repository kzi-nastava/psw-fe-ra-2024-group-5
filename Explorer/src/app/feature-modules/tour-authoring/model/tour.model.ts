import { Money } from "src/app/shared/model/money";
import { KeyPoint } from "./key-point.model";
import { TourLevel, TourStatus, TourTransport, Currency } from "./tour.enums"; // Adjust path as needed

export interface TransportDuration {
    duration: number;
    transport: TourTransport;
}

export interface TourReview {
    id?: number;
    rating: number;
    comment: string;
    visitDate: Date; // Adjust as needed
    reviewDate: Date; // Adjust as needed
    image?: string; // Optional
    tourId?: number;
    touristId?: number;
    completionPercentage: number;
    
}

export interface Tour {
    id?: number; // Optional
    name: string;
    description: string;
    tags: string;
    level?: TourLevel; // Use enum here
    status?: TourStatus; // Use enum here
    price: Money; // Required
    authorId?: number; // Optional
    keyPoints: KeyPoint[]; // Required
    reviews: TourReview[]; // Required
    length?: number; // Optional
    transportDurations: TransportDuration[]; // Required
    publishedTime: Date; // Required
    archivedTime: Date; // Required
}

export interface TourTourist {
    tour: Tour;
    canBeActivated: boolean;
    canBeBought: boolean;
    canBeReviewed: boolean;
}

export interface TourCreation {
    name: string;
    description: string;
    tags: string;
    level?: TourLevel; // Use enum here
    authorId?: number; // Optional
    keyPoints: KeyPoint[]; // Required
    length?: number; // Optional
    transportDurations: TransportDuration[]; // Required
}