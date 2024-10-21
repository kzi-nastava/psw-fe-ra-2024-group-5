import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from 'src/app/feature-modules/layout/home/home.component';
import { LoginComponent } from '../auth/login/login.component';
import { EquipmentComponent } from 'src/app/feature-modules/administration/equipment/equipment.component';
import { AuthGuard } from '../auth/auth.guard';
import { RegistrationComponent } from '../auth/registration/registration.component';
import { FacilityComponent } from 'src/app/feature-modules/tour-authoring/facility/facility.component';
import { TourComponent } from 'src/app/feature-modules/tour-authoring/tour/tour.component';
import { TourCreationComponent } from 'src/app/feature-modules/tour-authoring/tour-creation/tour-creation.component';

const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegistrationComponent},
  {path: 'equipment', component: EquipmentComponent, canActivate: [AuthGuard],},
  {path: 'facility', component: FacilityComponent},
  {path: 'tour', component: TourComponent},
  {path: 'tour-creation', component: TourCreationComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
