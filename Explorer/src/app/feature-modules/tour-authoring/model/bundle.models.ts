import { Money } from "src/app/shared/model/money";
import { TourCard } from "./tour-card.model";

export interface BundleDetailed{
    id: number,
    name: string,
    price: Money,
    authorId: number,
    bundleItems: number[],
    status: number
}

export interface BundleCard{
    id: number,
    name: string,
    price: Money,
    tours: TourCard[],
}