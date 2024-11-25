import { Money } from "src/app/shared/model/money";
import { KeyPoint } from "../../tour-authoring/model/key-point.model";

export interface OrderItem {
    id?: number;
    tourId: number;
    tourName: string;
    price : Money;
    imageUrl?: string;
    description?: string;
    tags? : string;
}
