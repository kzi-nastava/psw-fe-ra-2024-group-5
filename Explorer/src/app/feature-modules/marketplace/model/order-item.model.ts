import { Money } from "src/app/shared/model/money";

export interface OrderItem {
    id?: number;
    tourId: number;
    tourName: string;
    price : Money;
}
