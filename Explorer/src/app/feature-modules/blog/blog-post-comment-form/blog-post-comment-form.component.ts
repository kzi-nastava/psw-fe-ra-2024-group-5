import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BlogService } from '../blog.service';
import { BlogPostComment } from '../model/blog-post-comment.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
@Component({
  selector: 'xp-blog-post-comment-form',
  templateUrl: './blog-post-comment-form.component.html',
  styleUrls: ['./blog-post-comment-form.component.css']
})

export class BlogPostCommentFormComponent implements OnChanges{

  @Output() commentUpdated = new EventEmitter<null>();
  @Input() comment: BlogPostComment;
  @Input() shouldEdit: boolean = false;
  @Input() blogId: number;


  userId: number;

  constructor(private service: BlogService, private authService: AuthService) {
     // Pretplati se na promene korisnika i dohvati ID ulogovanog korisnika
     this.authService.user$.subscribe((user : User) => {
      this.userId = user.id;
    });
  }

  blogCommentForm = new FormGroup({
    commentText: new FormControl('', [Validators.required]), 
    lastEditedTime: new FormControl(undefined),  
  });

  ngOnChanges(chanes: SimpleChanges ): void {
    this.blogCommentForm.reset();
  
    if(this.shouldEdit && this.comment) {
      this.blogCommentForm.patchValue({
        commentText: this.comment.commentText,
      });
    }
  }

  updateBlogStatus(blogId: number): void {
    this.service.updateBlogStatusBasedOnVotesAndComments(blogId, this.userId).subscribe({
      next: (updatedBlog) => {
        console.log("Blog status updated successfully", updatedBlog);
      },
      error: (err) => {
        console.error("Error updating blog status:", err);
      }
    });
  }

  addComment(): void {
    console.log(this.blogCommentForm.value);

    const comment: BlogPostComment = {
      commentText: this.blogCommentForm.value.commentText || "",
      creationTime: new Date(),  
      lastEditedTime:  null,
      userId: this.userId,
      blogPostId: this.blogId
    };

    this.service.addComment(this.blogId, comment).subscribe({
      next: (_) => {
        this.updateBlogStatus(this.blogId)
        this.commentUpdated.emit()
        console.log("Comment added succesdfully");
        
      },
      error: (err) => {
        console.error('Error adding comment:', err);
      }
    });
  }

  updateComment() : void {
    const comment: BlogPostComment = {
      commentText: this.blogCommentForm.value.commentText || "",
      creationTime: this.comment.creationTime,  
      lastEditedTime: new Date(),
      userId: this.userId,
      blogPostId: this.blogId 

    };
    comment.id= this.comment.id;
    this.service.updateComment(this.blogId, this.comment.id!, comment).subscribe({
      next: (_) => {
        this.commentUpdated.emit()
        console.log("Comment updated succesdfully");
        
      },
      error: (err) => {
        console.error('Error updating comment:', err);
      }
    });
  }


}
