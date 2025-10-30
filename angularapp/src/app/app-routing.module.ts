import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { LoginComponent } from './components/login/login.component';
import { AdminaddserviceComponent } from './components/adminaddservice/adminaddservice.component';
import { AdminviewappointmentComponent } from './components/adminviewappointment/adminviewappointment.component';
import { AdminviewfeedbackComponent } from './components/adminviewfeedback/adminviewfeedback.component';
import { AdminviewserviceComponent } from './components/adminviewservice/adminviewservice.component';
import { AdminviewuserdetailsComponent } from './components/adminviewuserdetails/adminviewuserdetails.component';
import { ProfileComponent } from './components/profile/profile.component';
import { UseraddappointmentComponent } from './components/useraddappointment/useraddappointment.component';
import { UseraddfeedbackComponent } from './components/useraddfeedback/useraddfeedback.component';
import { UserviewappointmentComponent } from './components/userviewappointment/userviewappointment.component';
import { UserviewfeedbackComponent } from './components/userviewfeedback/userviewfeedback.component';
import { ErrorComponent } from './components/error/error.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AdminnavbarComponent } from './components/adminnavbar/adminnavbar.component';
import { UsernavbarComponent } from './components/usernavbar/usernavbar.component';

import { AdminGuard } from './guards/admin.guard';
import { UserGuard } from './guards/user.guard';

const routes: Routes = [
<<<<<<< HEAD
  {path:'',redirectTo:'home',pathMatch:'full'}, 
  {path:'home',component:HomeComponent},
  {path: 'registration', component: RegistrationComponent },
  {path: 'login', component: LoginComponent },
  {path:'adminaddservice',component:AdminaddserviceComponent},
  {path:'adminviewappointment',component:AdminviewappointmentComponent},
  {path:'adminviewfeedback',component:AdminviewfeedbackComponent},
  {path:'adminviewservice',component:AdminviewserviceComponent},
  {path:'adminviewuserdetails',component:AdminviewuserdetailsComponent},
  {path:'profile',component:ProfileComponent},
  {path:'useraddappointment',component:UseraddappointmentComponent},
  {path:'useraddfeedback',component:UseraddfeedbackComponent},
  {path:'userviewappointment',component:UserviewappointmentComponent},
  {path:'userviewfeedback',component:UserviewfeedbackComponent},
  {path:'error',component:ErrorComponent},
 
=======
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'registration', component: RegistrationComponent },
  { path: 'login', component: LoginComponent },

  // Admin routes
  { path: 'adminaddservice', component: AdminaddserviceComponent },
  { path: 'adminviewappointment', component: AdminviewappointmentComponent },
  { path: 'adminviewfeedback', component: AdminviewfeedbackComponent },
  { path: 'adminviewservice', component: AdminviewserviceComponent},
  { path: 'adminviewuserdetails', component: AdminviewuserdetailsComponent},

  // User routes
  { path: 'profile', component: ProfileComponent},
  { path: 'useraddappointment', component: UseraddappointmentComponent},
  { path: 'useraddfeedback', component: UseraddfeedbackComponent},
  { path: 'userviewappointment', component: UserviewappointmentComponent},
  { path: 'userviewfeedback', component: UserviewfeedbackComponent },

  // Error route
  { path: 'error', component: ErrorComponent },
  { path: 'admin/editservice/:id', component: AdminaddserviceComponent },
>>>>>>> origin/main
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
  
})
export class AppRoutingModule { }
