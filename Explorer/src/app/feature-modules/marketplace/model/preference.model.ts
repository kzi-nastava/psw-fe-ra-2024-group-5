import { TourDifficulty } from '../enum/tour-difficulty.enum';

export interface Preference {
    id?: number;
    touristId: number;
    preferredDifficulty: TourDifficulty;
    walkRating: number; 
    bikeRating: number; 
    carRating: number; 
    boatRating: number; 
    interestTags: string[]; 
}
