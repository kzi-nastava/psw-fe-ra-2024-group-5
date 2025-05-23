import { Money } from "src/app/shared/model/money";
import { KeyPoint } from "./key-point.model";

export interface TourCard{
    id: number,
    name: string,
    tags: string,
    level: number,
    status: number,
    price: Money,
    length: number,
    authorId: number,
    firstKeypoint: KeyPoint,
    publishedTime: Date,
    averageRating: number,
    imageUrl? : string
}