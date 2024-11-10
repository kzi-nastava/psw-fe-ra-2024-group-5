import { imageData } from "./imageData.model";

export interface createBlog {
    userId: number,
    title: string,
    description: string,
    images?: imageData[];
}