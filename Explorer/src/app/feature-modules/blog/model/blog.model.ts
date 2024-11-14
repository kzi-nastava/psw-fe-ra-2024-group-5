import { imageData } from "./imageData.model";
import { BlogPostComment } from './blog-post-comment'
import { Vote } from "./vote.model";

export interface Blog {
    id: number,
    userId: number,
    title: string,
    description: string,
    status: number,
    createdDate: string,
    votes?: Vote[];
    images?: imageData[]; 
    comments?: BlogPostComment[]; 
}