export enum Currency {
    Dol = 'Dol',
    Eur = 'Eur',
    Rsd = 'Rsd'
}
export interface Money {
    amount: number;
    currency: Currency;
}
