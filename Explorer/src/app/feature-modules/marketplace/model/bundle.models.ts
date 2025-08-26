import { Money } from "src/app/shared/model/money";
import { TourCard } from "../../tour-authoring/model/tour-card.model";
export interface BundleDetailed{
    id: number,
    name: string,
    price: Money,
    authorId: number,
    bundleItems: number[],
    status: BundleStatus
}

export interface BundleCard{
    id: number,
    name: string,
    price: Money,
    authorId: number,
    tours: TourCard[],
    status: BundleStatus
}

export enum BundleStatus {
  PUBLISHED = 'Published',
  DRAFT = 'Draft',
  ARCHIVED = 'Archive'
}
