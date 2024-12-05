import { Component, OnInit } from '@angular/core';
import { BlogService } from '../blog.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Blog } from '../model/blog.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { Vote } from '../model/vote.model';
import { BlogPostComment } from '../model/blog-post-comment'; 
import { map, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { BlogFormComponent } from '../blog-form/blog-form.component';

@Component({
  selector: 'xp-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {

  blogs: Blog[] = [];
  loadedBlogs: Blog[] = [];
  selectedFilter = 0;
  upvotes: { [key: number]: number } = {};
  downvotes: { [key: number]: number } = {};
  userVotes: { [blogId: number]: number | null } = {};
  isLoading = true;
  error: string | null = null;
  isAuthor: boolean = false; // Dodata promenljiva
  user: any; // Trenutni korisnik


  filteredComments: { [blogId: number]: BlogPostComment[] } = {};
  currentImageIndex: { [blogId: number]: number } = {};

  constructor(private service : BlogService,
              private authService : AuthService, 
              private router: Router,
              private dialog: MatDialog // Inject MatDialog
  ){}

  ngOnInit(): void {
  
    this.authService.user$.subscribe(user => {
      this.user = user; // Čuvamo podatke o korisniku
      this.isAuthor = user && user.role === 'Author'; // Provera da li je korisnik autor
    });
  
    this.getBlog();
  }

  getBlog(): void {
    this.service.getBlog().subscribe({
      next: (result: PagedResults<Blog>) => {
        this.blogs = result.results;
        this.isLoading = false;

        this.blogs.forEach(blog => {
          this.service.getUpvotes(blog.id).subscribe(upvoteCount => this.upvotes[blog.id] = upvoteCount);
          this.service.getDownvotes(blog.id).subscribe(downvoteCount => this.downvotes[blog.id] = downvoteCount);

          this.userVotes[blog.id] = null;
        });

        this.loadedBlogs = this.blogs;

        this.initializeImageIndex();

      },
      error: (err: any) => {
        this.error = 'Failed to load blogs';
        this.isLoading = false;
        console.error(err);
      }
    })
  }

  isBlogCreator(blogUserId: number): boolean {
    return this.user && this.user.id === blogUserId;
  }
  

  initializeImageIndex(): void {
    this.blogs.forEach(blog => {
      if (blog.images && blog.images.length > 0) {
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
      const imageCount = this.blogs.find(blog => blog.id === blogId)?.images?.length || 0;
      this.currentImageIndex[blogId] = imageCount - 1;
    }
  }

  
  updateBlogStatus(blogId: number, newStatus: number): void {
    this.authService.user$.subscribe(user => {
      if (user) {
        const userId = user.id;

        this.service.updateBlogStatus(blogId, newStatus, userId).subscribe({
          next: (updatedBlog) => {
            // Ako je blog sada u statusu "Published", pozovi ažuriranje statusa na osnovu glasova i komentara
            if (newStatus === 1) { // Proveri da li je status "Published"
              this.service.updateBlogStatusBasedOnVotesAndComments(blogId, userId).subscribe({
                next: () => {
                  // Osvježi listu blogova kako bi prikazao ažurirani status
                  this.getBlog();
                },
                error: (err) => {
                  console.error('Neuspešno ažuriranje statusa na osnovu glasova i komentara:', err);
                }
              });
            } else {
              // Osvježi listu blogova za bilo koje drugo ažuriranje statusa
              this.getBlog();
            }
          },
          error: (err) => {
            console.error('Neuspešno ažuriranje statusa bloga', err);
          }
        });
      } else {
        console.error('Korisnik nije ulogovan.');
      }
    });
  }




    vote(blogId: number, voteType: number): void {
      this.authService.user$.subscribe(user => {
        if (user) {
          // Check if user has already voted the same way
          if (this.userVotes[blogId] === voteType) {
            // User clicked the same vote type, remove vote
            this.removeVote(blogId, user.id);
          } else {
            // New vote or different vote type, add or update vote
            this.addVote(blogId, voteType, user.id);
          }
        } else {
          console.error('User is not logged in.');
        }
      });
    }

    addVote(blogId: number, voteType: number, userId: number): void {
      const voteData: Vote = {
        userId: userId,
        type: voteType,
        voteTime: new Date().toISOString(),
      };
      this.service.vote(blogId, voteData).subscribe({
        next: () => {
          // Update vote counts
          this.service.getUpvotes(blogId).subscribe(count => this.upvotes[blogId] = count);
          this.service.getDownvotes(blogId).subscribe(count => this.downvotes[blogId] = count);
          // Update user's current vote type for this blog
          this.userVotes[blogId] = voteType;
          console.log('Vote successfully submitted');
        },
        error: (err: any) => {
          console.error('Failed to submit vote:', err);
        }
      });
    }

    removeVote(blogId: number, userId: number): void {
      this.service.removeVote(blogId, userId).subscribe({
        next: () => {
          // Update vote counts
          this.service.getUpvotes(blogId).subscribe(count => this.upvotes[blogId] = count);
          this.service.getDownvotes(blogId).subscribe(count => this.downvotes[blogId] = count);
          // Reset user's current vote type for this blog (no vote)
          this.userVotes[blogId] = null;
          console.log('Vote successfully removed');
        },
        error: (err: any) => {
          console.error('Failed to remove vote:', err);
        }
      });
    }


    isUserAuthor(userId: number): Observable<boolean> {
      return this.authService.user$.pipe(
        map(user => {
          if (user) {
            const isAuthor = user.role === 'Author';
            const isSameUser = userId === user.id;
            return isAuthor && isSameUser;
          } else {
            console.error('User is not logged in.');
            return false;
          }
        })
      );
  }

  blogPreview(blogId: number): void {
    this.router.navigate(['/blog', blogId]);
  }

    applyFilter(): void {
      if (this.selectedFilter === -1) {
        this.blogs = this.loadedBlogs;
        return;
      }

      this.blogs = this.loadedBlogs.filter(blog => blog.status === this.selectedFilter);
    }


    openAddBlogDialog(): void {
      const dialogRef = this.dialog.open(BlogFormComponent, {
        width: '600px',
        //disableClose: true // Prevent closing on outside click
      });
  
      dialogRef.afterClosed().subscribe((result) => {
        if (result === 'created') {
          console.log('New blog created. Refreshing blogs...');
          this.getBlog(); // Osveži listu blogova
        } else {
          console.log('Dialog closed without creating a blog.');
        }
      });
    }
}
