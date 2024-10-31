import { Money } from "./money.model";
import { OrderItem } from "./order-item.model";

export interface ShoppingCart {
    id?: number;
    totalPrice : Money;
    touristId: number;
    Items:OrderItem[];
}
