  import { Component, OnInit,Input, EventEmitter, Output } from '@angular/core';
  import { BlogPostComment } from '../model/blog-post-comment.model';
  import { BlogService } from '../blog.service';
  import { PagedResults } from 'src/app/shared/model/paged-results.model';
  import { AuthService } from 'src/app/infrastructure/auth/auth.service';
  import { User } from 'src/app/infrastructure/auth/model/user.model';
  import { ChangeDetectorRef } from '@angular/core';


  @Component({
    selector: 'xp-blog-post-comment',
    templateUrl: './blog-post-comment.component.html',
    styleUrls: ['./blog-post-comment.component.css']
  })
  export class BlogPostCommentComponent implements OnInit  {

    blogComment : BlogPostComment[] = []
    selectedComment : BlogPostComment;
    shouldRenderBlogPostCommentForm: boolean = false;
    shouldEdit: boolean = false;
    userId : number;
    currentUser : User;
    @Input() blogId: number;
    @Input() isReadOnly: boolean = false;
    @Output() commentDeleted = new EventEmitter<void>();
    @Output() commentAction = new EventEmitter<void>();



    constructor ( private service: BlogService,  private authService: AuthService, private cdr: ChangeDetectorRef) {}

    ngOnInit(): void {


      this.authService.user$.subscribe((user : User) => {
        console.log('User data:', user);  // Dodaj ispis za proveru korisničkih podataka

        this.userId = user.id;
        this.currentUser = user;

        if (this.userId && this.blogId) {
        // this.getCommentsForUser();
          this.loadCommentsForBlog();
        }
      });
    }
    
    onCommentAction(): void {
      this.commentAction.emit();
  }
  

    loadCommentsForBlog(): void {
      this.service.getCommentsForBlog(this.blogId).subscribe({
        next: (result: PagedResults<BlogPostComment>) => {
          console.log('API result:', result);
    
          if (result && Array.isArray(result) && result.length > 0) {
            this.blogComment = result.map(com => ({
              ...com,
              creationTime: new Date(com.creationTime),
              lastEditedTime: com.lastEditedTime ? new Date(com.lastEditedTime) : null
            }));
            console.log('Mapped blogComment:', this.blogComment);
    
            // Forsiranje detekcije promena
            this.cdr.detectChanges();
          } else {
            console.log('No comments found for this blog.' + this.blogId);
          }
        },
        error: (err: any) => {
          console.error('Error:', err);
        }
      });
    }
    
    getCommentsForUser(): void {
      this.service.getCommentsForUser(this.userId).subscribe({
        next: (result: PagedResults<BlogPostComment>) => {

          console.log('API result:', result);  // Prikazuje kompletan rezultat

          if (Array.isArray(result)) {
            console.log('API first object:', result[0]); 
          }
    
          if (result && Array.isArray(result)) {
            this.blogComment = result.map(com => ({
              ...com,
              creationTime: new Date(com.creationTime),
              lastEditedTime: com.lastEditedTime ? new Date(com.lastEditedTime) : null
            }));
            console.log('Mapped blogComment:', this.blogComment);
          } else {
            console.error('API did not return expected data.');
          }
        },
        error: (err: any) => {
          console.error('Error:', err);
        }
      });
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

    deleteComment(id: number): void {
      this.service.deleteComment(this.blogId, id,this.userId).subscribe({
        next: () => {
          this.commentDeleted.emit();
          this.updateBlogStatus(this.blogId);
          this. loadCommentsForBlog();
          this.cdr.detectChanges();
          
        },
      })
    }

    onEditClicked(comment : BlogPostComment): void {
      this.selectedComment = comment;
      this.shouldRenderBlogPostCommentForm = true;
      this.shouldEdit = true;
    }

    onAddClicked() : void {
      this.shouldEdit =false;
      this.shouldRenderBlogPostCommentForm = true;
    }


  }
