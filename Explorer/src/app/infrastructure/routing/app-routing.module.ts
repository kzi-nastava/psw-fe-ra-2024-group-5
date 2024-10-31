import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from 'src/app/feature-modules/layout/home/home.component';
import { LoginComponent } from '../auth/login/login.component';
import { EquipmentComponent } from 'src/app/feature-modules/administration/equipment/equipment.component';
import { AuthGuard } from '../auth/auth.guard';
import { RegistrationComponent } from '../auth/registration/registration.component';
import { AccountsComponent } from 'src/app/feature-modules/administration/accounts/accounts.component';
import { FacilityComponent } from 'src/app/feature-modules/tour-authoring/facility/facility.component';
import { UserProfileComponent } from 'src/app/feature-modules/administration/user-profile/user-profile.component';
import { UserProfileFormComponent } from 'src/app/feature-modules/administration/user-profile-form/user-profile-form.component';
import { EquipmentManagementComponent } from 'src/app/feature-modules/tour-execution/equipment-management/equipment-management.component';
import { KeyPointsComponent } from 'src/app/feature-modules/tour-authoring/key-points/key-points.component';
import { TourComponent } from 'src/app/feature-modules/tour-authoring/tour/tour.component';
import { TourCreationComponent } from 'src/app/feature-modules/tour-authoring/tour-creation/tour-creation.component';
import { TourEditComponent } from 'src/app/feature-modules/tour-authoring/tour-edit/tour-edit.component';
import { PreferenceComponent } from 'src/app/feature-modules/marketplace/preference/preference.component';
import { BlogComponent } from 'src/app/feature-modules/blog/blog-post/blog.component';
import { BlogFormComponent } from 'src/app/feature-modules/blog/blog-form/blog-form.component';
import { TourMapComponent } from 'src/app/feature-modules/tour-authoring/tour-map/tour-map.component';
import { LandingComponent } from 'src/app/feature-modules/layout/landing/landing.component';
import { BlogPostCommentComponent } from 'src/app/feature-modules/blog/blog-post-comment/blog-post-comment.component';
import { BlogPostCommentFormComponent } from 'src/app/feature-modules/blog/blog-post-comment-form/blog-post-comment-form.component';
import { ClubComponent } from 'src/app/feature-modules/club/club/club.component';
import { ExecuteTourComponent } from 'src/app/feature-modules/tour-execution/execute-tour/execute-tour.component';

const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegistrationComponent },
  { path: 'profile', component: UserProfileComponent },
  { path: 'profile/:id', component: UserProfileComponent },
  { path: 'profile/profile-form/:id', component: UserProfileFormComponent },
  { path: 'equipment', component: EquipmentComponent, canActivate: [AuthGuard] },
  { path: 'facility', component: FacilityComponent },
  { path: 'tour-map', component: TourMapComponent },
  { path: 'equipment-management', component: EquipmentManagementComponent, canActivate: [AuthGuard], },
  { path: 'tour', component: TourComponent },
  { path: 'tour-creation', component: TourCreationComponent },
  { path: 'tour-edit/:tourId', component: TourEditComponent },
  { path: 'accounts', component: AccountsComponent },
  { path: 'preferences', component: PreferenceComponent },
  { path: 'blog', component: BlogComponent },
  { path: 'addBlog', component: BlogFormComponent },
  { path: 'create-comment', component: BlogPostCommentComponent },
  { path: 'add-comment', component: BlogPostCommentFormComponent },
  { path: 'clubs', component: ClubComponent },
  { path: 'tour-execution/:tourId', component: ExecuteTourComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
