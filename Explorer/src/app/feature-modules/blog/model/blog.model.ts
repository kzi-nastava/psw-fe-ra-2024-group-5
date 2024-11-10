import { imageData } from "./imageData.model";
import { BlogPostComment } from './blog-post-comment'

export interface Blog {
    id: number,
    title: string,
    description: string,
    status: number,
    createdDate: string,
    images?: imageData[]; 
    comments?: BlogPostComment[]; 
}