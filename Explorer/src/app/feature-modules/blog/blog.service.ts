import { HttpBackend, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { BlogPostComment } from './model/blog-post-comment';
import { environment } from 'src/env/environment';
import { Blog } from './model/blog.model';
import { createBlog } from './model/createBlog.model';
import { Vote } from './model/vote.model';
import { map } from 'leaflet';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  
  constructor( private http: HttpClient) { }



  addComment(blogId: number, comment: BlogPostComment): Observable<BlogPostComment> {
    return this.http.post<BlogPostComment>(`${environment.apiHost}author/blog/${blogId}/comments`, comment);
  }

  updateComment(blogId: number, commentId: number, comment: BlogPostComment): Observable<BlogPostComment> {
    return this.http.put<BlogPostComment>(`${environment.apiHost}author/blog/${blogId}/comments/${commentId}`, comment);
  }

  deleteComment(blogId: number, commentId: number, userId: number): Observable<BlogPostComment> {
    return this.http.delete<BlogPostComment>(`${environment.apiHost}author/blog/${blogId}/comments/${commentId}?userId=${userId}`);
  }

  getCommentsForBlog(blogId: number): Observable<PagedResults<BlogPostComment>> {
    return this.http.get<PagedResults<BlogPostComment>>(`${environment.apiHost}author/blog/${blogId}/comments`);
}


  getCommentsForUser(userId: number): Observable<PagedResults<BlogPostComment>> {
    return this.http.get<PagedResults<BlogPostComment>>(`${environment.apiHost}blog/comments/user/${userId}`);
  }

  getBlog(): Observable<PagedResults<Blog>> {
    return this.http.get<PagedResults<Blog>>(environment.apiHost + 'author/blog/all')
  }

  updateBlogStatus(blogId: number, newStatus: number, userId: number): Observable<Blog> {
    return this.http.put<Blog>(environment.apiHost + `author/blog/${blogId}/status?userId=${userId}`, newStatus);
  }

  // updateBlogStatus(blogId: number, newStatus: number, userId: number): Observable<void> {
  //   return this.http.put<void>(`${environment.apiHost}author/blog/${blogId}/status?userId=${userId}`, newStatus).pipe(
  //     switchMap(() => this.http.post<void>(`${environment.apiHost}author/blog/${blogId}/update-status`, {}))
  //   );
  // }

  // updateBlogStatusBasedOnVotesAndComments(blogId: number): Observable<string> {
  //   return this.http.post(`${environment.apiHost}author/blog/${blogId}/update-status`, {}, { responseType: 'text' });
  // }
  
  updateBlogStatusBasedOnVotesAndComments(blogId: number, userId: number): Observable<Blog> {
    return this.http.put<Blog>(`${environment.apiHost}author/blog/${blogId}/update-status?userId=${userId}`, {} );
}

  

  createBlog(blog: createBlog): Observable<createBlog>{
    return this.http.post<createBlog>(environment.apiHost + 'author/blog/create', blog);
  }

  vote(blogId: number, voteData: Vote): Observable<void> {
    return this.http.post<void>(environment.apiHost + `author/blog/${blogId}/vote`, voteData);
  }

  removeVote(blogId: number, userId: number): Observable<number>{
    return this.http.delete<number>(environment.apiHost + `author/blog/${blogId}/vote?userId=${userId}`);
  }
  
  getUpvotes(blogId: number): Observable<number> {
    return this.http.get<number>(environment.apiHost + `author/blog/${blogId}/upvotes`);
  }
  
  getDownvotes(blogId: number): Observable<number> {
    return this.http.get<number>(environment.apiHost + `author/blog/${blogId}/downvotes`);

  }
  
}
