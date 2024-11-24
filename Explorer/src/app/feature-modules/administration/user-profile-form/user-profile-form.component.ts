import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TokenStorage } from '../../../infrastructure/auth/jwt/token.service';
import { UserProfile } from '../model/userProfile.model';
import { UserProfileService } from '../user-profile.service';
import { Router } from '@angular/router';

@Component({
  selector: 'xp-user-profile-form',
  templateUrl: './user-profile-form.component.html',
  styleUrls: ['./user-profile-form.component.css']
})
export class UserProfileFormComponent implements OnInit {
  @Input() userName: string;
  profileForm: FormGroup;
  userProfile: UserProfile;
  id: number;

  constructor(private fb: FormBuilder, private tokenStorage: TokenStorage,
    private service: UserProfileService, private router: Router) { }

  get profileImage() { return this.profileForm.get('profileImage')?.value }

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      profileImage: [''],
      name: ['', Validators.required],
      surname: ['', Validators.required],
      biography: [''],
      motto: ['']
    });

    const userId = this.tokenStorage.getUserId();

    if (userId) {
      this.service.getUserProfile(+userId).subscribe({
        next: (result: UserProfile) => {
          this.userProfile = result;
          this.id = this.userProfile.id;
          if (this.userProfile) {
            //console.log(this.userProfile.name);
            this.profileForm.patchValue({
              profileImage: this.userProfile.profileImage || '',
              name: this.userProfile.name || '',
              surname: this.userProfile.surname || '',
              biography: this.userProfile.biography || '',
              motto: this.userProfile.motto || ''
            });
          } else {
            console.error("User profile is undefined");
          }
        },
        error: (err: any) => {
          console.log(err);
        }
      });
    } else {
      console.error("User ID is null");
    }
  }

  triggerFileInput(): void {
    const fileInput = document.getElementById('profileImage') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        const base64String = reader.result as string;
        const base64WithoutPrefix = base64String.replace(/^data:(.*?);base64,/, '');
        this.profileForm.get('profileImage')?.setValue(base64WithoutPrefix);
      };

      reader.readAsDataURL(file);
    }
  }


  onSubmit() {
    const userId = this.tokenStorage.getUserId();

    if (this.id !== null && userId !== null) {
      const updatedProfile: UserProfile = {
        userId: userId,
        id: this.id,
        name: this.profileForm.value.name,
        surname: this.profileForm.value.surname,
        biography: this.profileForm.value.biography,
        motto: this.profileForm.value.motto,
        profileImage: 'data:image/png;base64,' + this.profileForm.value.profileImage,
      };

      if (this.profileForm.invalid) {
        this.profileForm.markAllAsTouched();
        return;
      }

      if (userId !== null && this.profileForm.valid) {
        this.service.updateUserProfile(userId, updatedProfile).subscribe({
          next: (response) => {
            this.router.navigate(['profile']);
          },
          error: (err) => {
            console.error("Error updating profile: ", err);
          }
        });
      }
    }
  }

}
