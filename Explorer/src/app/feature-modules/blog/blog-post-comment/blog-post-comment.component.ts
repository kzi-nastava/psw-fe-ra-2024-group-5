import { Component, OnInit } from '@angular/core';
import { BlogPostComment } from '../model/blog-post-comment';
import { BlogService } from '../blog.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';

@Component({
  selector: 'xp-blog-post-comment',
  templateUrl: './blog-post-comment.component.html',
  styleUrls: ['./blog-post-comment.component.css']
})
export class BlogPostCommentComponent implements OnInit  {

   blogComment : BlogPostComment[] = []

  constructor ( private service: BlogService) {}

  // ngOnInit(): void {
  //   console.log("ngOnInit se pokreće");
  //   this.service.getComment().subscribe({
  //     next: (result : PagedResults<BlogPostComment>) =>{
  //        console.log(result);
  //      this.blogComment = result.results;
  //     },
  //     error: (err: any) => {
  //       console.log(err)
  //       console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
  //     }

  //   });

  ngOnInit(): void {
    this.service.getComment().subscribe({
      next: (result: PagedResults<BlogPostComment>) => {
        // Ovdje dodaj logove za proveru rezultata
        console.log('API result:', result);  // Prikazuje kompletan rezultat
        console.log('API result type:', typeof result);  // Prikazuje tip rezultata
        if (Array.isArray(result)) {
          console.log('API first object:', result[0]);  // Prikazuje prvi objekat ako je niz
        }
  
        // Proverava i mapira podatke ako su tačni
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
  
  
  // blogComment : BlogPostComment [] = [{
  //   text: 'HIHIHIHHIHI',
  //   userId: 0,
  //   creationTime: new Date(new Date().getTime() - (60 * 60 * 1000)),
  //   lastUpdatedTime: new Date(new Date().getTime() - (60 * 60 * 1000))
  // }]
}
