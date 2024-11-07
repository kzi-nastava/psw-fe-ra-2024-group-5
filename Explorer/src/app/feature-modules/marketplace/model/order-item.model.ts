import { Money } from "./money.model";

export interface OrderItem {
    id?: number;
    tourId: number;
    tourName: string;
    price : Money;
}
