export interface BlogPostComment {
        id?: number;
        blogPostId?: number;
        userId: number;
        commentText: string;  
        creationTime: Date; 
        lastEditedTime: Date | null;  
    }
    