import { Component, OnInit, ElementRef } from '@angular/core';
import { Blog } from '../model/blog.model';
import { BlogPostComment } from '../model/blog-post-comment.model';
import { ActivatedRoute } from '@angular/router';
import { BlogService } from '../blog.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';

@Component({
  selector: 'xp-blog-preview',
  templateUrl: './blog-preview.component.html',
  styleUrls: ['./blog-preview.component.css']
})
export class BlogPreviewComponent implements OnInit {

  blog: Blog = {} as Blog;
  currentImageIndex: { [blogId: number]: number } = {};
  userId : number;
  currentUser : User;
  editingCommentId: number | null = null;
  editedCommentText: string = '';
  newCommentText: string = '';
  newCommentId: number | null = null;

  constructor(private route: ActivatedRoute, private blogService: BlogService, private authService: AuthService) {}
  
    ngOnInit(): void {
      const blogId = Number(this.route.snapshot.paramMap.get('id'));
      if (blogId) {
        this.fetchBlogDetails(blogId);
      }

      this.authService.user$.subscribe((user : User) => {
        console.log('User data:', user);  // Dodaj ispis za proveru korisničkih podataka
        this.userId = user.id;
        this.currentUser = user;
      });
    }

  fetchBlogDetails(blogId: number): void {
    this.blogService.getBlogById(blogId).subscribe((data) => {
      this.blog = data;
      console.log(data);
      console.log(data.images);
      this.initializeImageIndex();
    });
  }

  initializeImageIndex(): void {
    if (this.blog && this.blog.images && this.blog.images.length > 0) {
      this.currentImageIndex[this.blog.id] = 0; 
    }
  }
  
  nextImage(blogId: number): void {
    if (this.blog && this.blog.images && this.blog.images.length > 0) {
      const imageCount = this.blog.images.length;
      if (this.currentImageIndex[blogId] < imageCount - 1) {
        this.currentImageIndex[blogId]++;
      } else {
        this.currentImageIndex[blogId] = 0; 
      }
    }
  }
  
  previousImage(blogId: number): void {
    if (this.blog && this.blog.images && this.blog.images.length > 0) {
      if (this.currentImageIndex[blogId] > 0) {
        this.currentImageIndex[blogId]--;
      } else {
        this.currentImageIndex[blogId] = this.blog.images.length - 1;
      }
    }
  }

  isCommentAuthor(userId: number): boolean {
    return this.userId === userId;
  }

  editComment(commentId: number, currentText: string): void {
    this.editingCommentId = commentId;
    this.editedCommentText = currentText;
  }

  saveComment(commentId: number): void {
    this.blog.comments = this.blog.comments || [];
    const existingComment = this.blog.comments.find(comment => comment.id === commentId);
    
    if (!existingComment) {
      console.error(`Comment with ID ${commentId} not found.`);
      return;
    }
  
    const updatedComment: BlogPostComment = {
      ...existingComment,
      commentText: this.editedCommentText,
      lastEditedTime: new Date(),
      userId: this.userId!
    };
  
    this.blogService.updateComment(this.blog.id, commentId, updatedComment).subscribe((updated) => {
      existingComment.commentText = updated.commentText;
      existingComment.lastEditedTime = updated.lastEditedTime;
      this.editingCommentId = null; // Exit edit mode
      this.editedCommentText = ''; // Clear the edited text
    });
  }
  
  addComment(): void {
    if (this.blog.status === 0 || this.blog.status === 2){
      return;
    }

    if (!this.newCommentText.trim()) return;

    const newComment: BlogPostComment = {
      commentText: this.newCommentText,
      creationTime: new Date(),
      lastEditedTime: null,
      userId: this.userId!, // Assuming you have a way to get the logged-in user ID
      blogPostId: this.blog.id
    };

    // Call the service to add the comment
    this.blogService.addComment(this.blog.id, newComment).subscribe((addedComment) => {
      this.blog.comments = this.blog.comments || [];
      this.blog.comments.push(addedComment);
      this.newCommentText = ''; 

      setTimeout(() => this.scrollToComment(addedComment.id!), 100);
    });
  }
  
  scrollToComment(commentId: number): void {
    const commentElement = document.getElementById(`comment-${commentId}`);
    if (commentElement) {
      commentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  cancelEdit(): void {
    this.editingCommentId = null;
    this.editedCommentText = '';
  }

  deleteComment(commentId: number): void {
    this.blogService.deleteComment(this.blog.id, commentId, this.userId).subscribe({
      next: () => {
        this.ngOnInit();
      },
    })
  }
  
}
