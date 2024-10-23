import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from 'src/app/feature-modules/layout/home/home.component';
import { LoginComponent } from '../auth/login/login.component';
import { EquipmentComponent } from 'src/app/feature-modules/administration/equipment/equipment.component';
import { AuthGuard } from '../auth/auth.guard';
import { RegistrationComponent } from '../auth/registration/registration.component';
import { AccountsComponent } from 'src/app/feature-modules/administration/accounts/accounts.component';
import { FacilityComponent } from 'src/app/feature-modules/tour-authoring/facility/facility.component';
import { PreferenceComponent } from 'src/app/feature-modules/marketplace/preference/preference.component';
import { BlogComponent } from 'src/app/feature-modules/blog/blog-post/blog.component';
import { BlogFormComponent } from 'src/app/feature-modules/blog/blog-form/blog-form.component';
import { TourMapComponent } from 'src/app/feature-modules/tour-authoring/tour-map/tour-map.component';


const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegistrationComponent },
  { path: 'equipment', component: EquipmentComponent, canActivate: [AuthGuard] },
  { path: 'facility', component: FacilityComponent },
  { path: 'tour-map', component: TourMapComponent },
  { path: 'accounts', component: AccountsComponent },
  { path: 'preferences', component: PreferenceComponent } 
  {path: 'blog', component:BlogComponent},
  {path: 'addBlog', component:BlogFormComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
