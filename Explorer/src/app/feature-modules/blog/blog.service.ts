import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Blog } from './model/blog.model';
import { environment } from 'src/env/environment';
import { createBlog } from './model/createBlog.model';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  constructor(private http : HttpClient) { }

  getBlog(): Observable<PagedResults<Blog>> {
    return this.http.get<PagedResults<Blog>>(environment.apiHost + 'author/blog')
  }

  updateBlogStatus(blogId: number, newStatus: number, userId: number): Observable<Blog> {
    return this.http.put<Blog>(environment.apiHost + `author/blog/${blogId}/status/${userId}`, newStatus);
  }

  createBlog(blog: createBlog): Observable<createBlog>{
    return this.http.post<createBlog>(environment.apiHost + 'author/blog', blog);
  }
  
}
