import { Money } from "src/app/shared/model/money";

export interface Wallet {
    id?: number;
    balance: Money;
    touristId: number;
}