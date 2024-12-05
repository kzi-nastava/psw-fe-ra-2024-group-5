import { Money } from "src/app/shared/model/money";
import { BundleOrderItem, OrderItem } from "./order-item.model";

export interface ShoppingCart {
    id?: number;
    totalPrice : Money;
    touristId: number;
    tourItems: OrderItem[];
    bundleItems: BundleOrderItem[];
}
