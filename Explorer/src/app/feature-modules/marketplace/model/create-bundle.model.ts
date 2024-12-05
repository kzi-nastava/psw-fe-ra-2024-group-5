import { Money } from "src/app/shared/model/money";

export interface createBundle{
    name: string;
    price: Money;
    authorId: number;
    bundleItems: number[];
}