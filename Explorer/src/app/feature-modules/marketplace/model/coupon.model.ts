import { Tour } from "../../tour-authoring/model/tour.model";

export interface Coupon {
    id : number;
    code: string;
    percentage: number ;
    expiredDate: Date; 
    tourIds: number[];
    tourName? : Tour[];
    imageUrl?: string;
  }
  