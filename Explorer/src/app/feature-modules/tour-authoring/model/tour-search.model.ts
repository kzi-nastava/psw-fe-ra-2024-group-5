export interface TourSearchParams {
    page: number;
    pageSize: number;
    startLat?: number,
    endLat?: number,
    startLong?: number,
    endLong?: number,
    name?: string,
    length?: number
}