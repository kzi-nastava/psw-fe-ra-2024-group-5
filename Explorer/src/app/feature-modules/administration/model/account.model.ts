import { Money } from "src/app/shared/model/money";

export interface Account {
    id?: number;
    username: string;
    email: string;
    role: string;
    isActive: boolean;
    walletBalance?: Money
}