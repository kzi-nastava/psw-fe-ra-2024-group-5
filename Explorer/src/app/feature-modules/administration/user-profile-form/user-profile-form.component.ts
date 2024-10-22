import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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
  profileForm: FormGroup;
  userProfile: UserProfile;
  id: number;

  constructor(private fb: FormBuilder, private tokenStorage: TokenStorage, 
    private service: UserProfileService, private router: Router) { }

    ngOnInit(): void {
      this.profileForm = this.fb.group({
          name: [''],
          surname: [''],
          biography: [''],
          motto: ['']
      });
  
      const userId = this.tokenStorage.getUserId();
  
      if (userId) {
        console.log("bla");
          this.service.getUserProfile(+userId).subscribe({
              next: (result: UserProfile) => {
                console.log("bla");
                  this.userProfile = result;
                  this.id = this.userProfile.id;
                  if (this.userProfile) {
                    console.log(this.userProfile.name);
                      this.profileForm.patchValue({
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
  

  onSubmit() {
    const userId = this.tokenStorage.getUserId();

    if (this.id !== null && userId !== null) {  
      const updatedProfile: UserProfile = {
        userId: userId,
        id: this.id,  
        name: this.profileForm.value.name,
        surname: this.profileForm.value.surname,
        biography: this.profileForm.value.biography,
        motto: this.profileForm.value.motto
      };

      if(userId !== null) {
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
