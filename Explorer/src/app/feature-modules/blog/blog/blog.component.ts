import { Component, OnInit } from '@angular/core';
import { BlogService } from '../blog.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Blog } from './model/blog.model';

@Component({
  selector: 'xp-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {

  blogs: Blog[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(private service : BlogService){}

  ngOnInit(): void {
    this.getBlog();
  }

  getBlog(): void {
    this.service.getBlog().subscribe({
      next: (result: PagedResults<Blog>) => {
        this.blogs = result.results;
        this.isLoading = false
        console.log(result)
      },
      error: (err: any) => {
        this.error = 'Failed to load blogs';
        this.isLoading = false;
        console.error(err);
      }
    })
  }

}
