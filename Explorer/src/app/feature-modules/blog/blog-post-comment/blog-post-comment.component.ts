import { Component, OnInit,Input } from '@angular/core';
import { BlogPostComment } from '../model/blog-post-comment';
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

  constructor ( private service: BlogService,  private authService: AuthService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {

    if ( this.blogId) {
      // this.getCommentsForUser();
       this.loadCommentsForBlog();
 
     }
    // this.authService.user$.subscribe((user : User) => {
    //   console.log('User data:', user);  // Dodaj ispis za proveru korisničkih podataka

    //   this.userId = user.id;
    //   this.currentUser = user;

    //   if (this.userId && this.blogId) {
    //    // this.getCommentsForUser();
    //     this.loadCommentsForBlog();
    //   }
    // });
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

  deleteComment(id: number): void {
    this.service.deleteComment(id).subscribe({
      next: () => {
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
