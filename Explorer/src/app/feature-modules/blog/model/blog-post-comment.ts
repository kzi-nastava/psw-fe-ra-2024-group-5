export interface BlogPostComment {
        id?: number;
        //blogId?: number;
        userId: number;
        commentText: string;  
        creationTime: Date; 
        lastEditedTime: Date | null;  
    }
    