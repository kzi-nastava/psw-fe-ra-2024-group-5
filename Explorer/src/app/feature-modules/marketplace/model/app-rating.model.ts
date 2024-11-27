// app-rating.model.ts
export interface AppRating {
  id?: number;  // Make id optional since it might not exist for new ratings
  userId: number;
  grade: number;
  comment: string;
  timeStamp: Date | string;
  [key: string]: any;
}