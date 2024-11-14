import { Money } from "src/app/shared/model/money";
import { OrderItem } from "./order-item.model";

export interface ShoppingCart {
    id?: number;
    totalPrice : Money;
    touristId: number;
    items:OrderItem[];
}
