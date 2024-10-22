import { HttpBackend, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { BlogPostComment } from './model/blog-post-comment';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  constructor( private http: HttpClient) { }

  getComment() : Observable<PagedResults<BlogPostComment>> {
    return this.http.get<PagedResults<BlogPostComment>>('https://localhost:44333/api/blog/comments/user/2');
  }
  
  
}
