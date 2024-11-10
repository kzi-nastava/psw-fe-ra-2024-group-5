import { Component, OnInit } from '@angular/core';
import { BlogService } from '../blog.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Blog } from '../model/blog.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { BlogPostComment } from '../model/blog-post-comment'; 


@Component({
  selector: 'xp-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {

  blogs: Blog[] = [];
  isLoading = true;
  error: string | null = null;

  filteredComments: { [blogId: number]: BlogPostComment[] } = {};
  currentImageIndex: { [blogId: number]: number } = {};

  constructor(private service : BlogService, private authService : AuthService){}

  ngOnInit(): void {
    this.getBlog();
  }

  getBlog(): void {
    this.service.getBlog().subscribe({
      next: (result: PagedResults<Blog>) => {
        this.blogs = result.results;
        this.isLoading = false;
        console.log(result);
        this.initializeImageIndex();
        
      },
      error: (err: any) => {
        this.error = 'Failed to load blogs';
        this.isLoading = false;
        console.error(err);
      }
    })
  }



  initializeImageIndex(): void {
    this.blogs.forEach(blog => {
      if (blog.imageData && blog.imageData.length > 0) {
        this.currentImageIndex[blog.id] = 0; 
      }
    });
  }

  nextImage(blogId: number, imageCount: number): void {
    if (this.currentImageIndex[blogId] < imageCount - 1) {
      this.currentImageIndex[blogId]++;
    } else {
      this.currentImageIndex[blogId] = 0; 
    }
  }

  previousImage(blogId: number): void {
    if (this.currentImageIndex[blogId] > 0) {
      this.currentImageIndex[blogId]--;
    } else {
      const imageCount = this.blogs.find(blog => blog.id === blogId)?.imageData?.length || 0;
      this.currentImageIndex[blogId] = imageCount - 1;
    }
  }

  updateBlogStatus(blogId: number, newStatus: number): void {
    this.authService.user$.subscribe(user => {
      if (user && user.id){
        const userId = user.id;

        this.service.updateBlogStatus(blogId, newStatus, userId).subscribe({
          next: (updatedBlog) => {
            this.blogs = this.blogs.map(blog => blog.id === updatedBlog.id ? updatedBlog : blog);
            this.getBlog()
          },
          error: (err) => {
            console.error('Failed to update blog status', err);
          }
        });
      } else {
        console.error('User is not loged in.')
      }
    })
    
  }

}
