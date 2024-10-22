import { HttpBackend, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { BlogPostComment } from './model/blog-post-comment';
import { environment } from 'src/env/environment';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  

  constructor( private http: HttpClient) { }

  getComment() : Observable<PagedResults<BlogPostComment>> {
    return this.http.get<PagedResults<BlogPostComment>>('https://localhost:44333/api/blog/comments/user/2');
  }
  
  addComment(comment: BlogPostComment) : Observable<BlogPostComment> {
    return this.http.post<BlogPostComment>('https://localhost:44333/api/blog/comments/',comment);
  }
  
  deleteComment(id: number): Observable<BlogPostComment> {
    return this.http.delete<BlogPostComment>(environment.apiHost + 'blog/comments/' + id);
  }

  updateComment(comment: BlogPostComment): Observable<BlogPostComment> {
    return this.http.put<BlogPostComment>(environment.apiHost + 'blog/comments/' + comment.id, comment);
  }


  // getCommentsForUser(userId: number): Observable<PagedResults<BlogPostComment>> {
  //   return this.http.get<PagedResults<BlogPostComment>>('https://localhost:44333/api/blog/comments/user/${userId}');
  // }

  getCommentsForUser(userId: number): Observable<PagedResults<BlogPostComment>> {
    return this.http.get<PagedResults<BlogPostComment>>(`${environment.apiHost}blog/comments/user/${userId}`);
  }
  


}
