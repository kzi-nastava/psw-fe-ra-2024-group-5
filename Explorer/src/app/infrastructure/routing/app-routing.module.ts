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
import { TourDetailedViewComponent } from 'src/app/feature-modules/tour-authoring/tour-view/tour-view.component';
import { PreferenceComponent } from 'src/app/feature-modules/marketplace/preference/preference.component';
import { BlogComponent } from 'src/app/feature-modules/blog/blog-post/blog.component';
import { BlogFormComponent } from 'src/app/feature-modules/blog/blog-form/blog-form.component';
import { LandingComponent } from 'src/app/feature-modules/layout/landing/landing.component';
import { BlogPostCommentComponent } from 'src/app/feature-modules/blog/blog-post-comment/blog-post-comment.component';
import { BlogPostCommentFormComponent } from 'src/app/feature-modules/blog/blog-post-comment-form/blog-post-comment-form.component';
import { ClubComponent } from 'src/app/feature-modules/club/club/club.component';
import { ExecuteTourComponent } from 'src/app/feature-modules/tour-execution/execute-tour/execute-tour.component';
import { AppRatingFormComponent } from 'src/app/feature-modules/marketplace/app-rating-form/app-rating-form.component';
import { AppRatingComponent } from 'src/app/feature-modules/administration/app-rating/app-rating.component';
import { ShoppingCartComponent } from 'src/app/feature-modules/marketplace/shopping-cart/shopping-cart.component';
import { FollowersListComponent } from 'src/app/feature-modules/administration/followers-list/followers-list.component';
import { ToursPageComponent } from 'src/app/feature-modules/tour-authoring/tours-page/tours-page.component';
import { MyClubsComponent } from 'src/app/feature-modules/club/my-clubs/my-clubs.component';
import { ClubPageComponent } from 'src/app/feature-modules/club/club-page/club-page.component';
import { BlogPreviewComponent } from 'src/app/feature-modules/blog/blog-preview/blog-preview.component';
import { EncountersManagingComponent } from 'src/app/feature-modules/encounter/encounters-managing/encounters-managing.component';
import { EncounterComponent } from 'src/app/feature-modules/encounter/encounter/encounter.component';
import { ToursAuthorPageComponent } from 'src/app/feature-modules/tour-authoring/tours-author-page/tours-author-page.component';
import { EncountersApprovalComponent } from 'src/app/feature-modules/encounter/encounters-approval/encounters-approval.component';
import { CouponsComponent } from 'src/app/feature-modules/marketplace/coupons/coupons.component';
import { CouponFormComponent } from 'src/app/feature-modules/marketplace/coupon-form/coupon-form.component';
import { BundlesPageComponent } from 'src/app/feature-modules/marketplace/bundle-page/bundles-page.component';

const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'home', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegistrationComponent },
  { path: 'profile', component: UserProfileComponent },
  { path: 'profile/:id', component: UserProfileComponent },
  { path: 'profile/profile-form/:id', component: UserProfileFormComponent },
  { path: 'equipment', component: EquipmentComponent, canActivate: [AuthGuard] },
  { path: 'facility', component: FacilityComponent },
  { path: 'equipment-management', component: EquipmentManagementComponent, canActivate: [AuthGuard], },
  { path: 'tours', component: TourComponent },
  { path: 'tour-creation', component: TourCreationComponent },
  { path: 'tour-detailed-view/:tourId', component: TourDetailedViewComponent },
  { path: 'accounts', component: AccountsComponent },
  { path: 'preferences', component: PreferenceComponent },
  { path: 'blog', component: BlogComponent },
  { path: 'addBlog', component: BlogFormComponent },
  { path: 'create-comment', component: BlogPostCommentComponent },
  { path: 'add-comment', component: BlogPostCommentFormComponent },
  { path: 'clubs', component: ClubComponent },
  { path: 'tour-execution/:tourId', component: ExecuteTourComponent },
  { path: 'appRating', component: AppRatingComponent },
  { path: 'appRatingForm', component: AppRatingFormComponent },
  { path: 'shopping-cart', component: ShoppingCartComponent },
  { path: 'tour-execution', component: ExecuteTourComponent },
  { path: 'followers/:id', component: FollowersListComponent },
  { path: 'tours-page', component: ToursPageComponent },
  { path: 'tours-author-page', component: ToursAuthorPageComponent },
  { path: 'my-clubs', component: MyClubsComponent},
  { path: 'my-clubs/:id', component: ClubPageComponent},
  { path: 'blog/:id', component: BlogPreviewComponent},
  { path: 'encounters-managing', component: EncountersManagingComponent},
  { path: 'encounters', component: EncounterComponent},
  { path: 'encounters-approval', component: EncountersApprovalComponent},
  { path: 'view-coupons', component: CouponsComponent},
  { path: 'form-coupons', component: CouponFormComponent},
  { path: 'bundles-page', component: BundlesPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
