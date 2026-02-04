import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './Pages/home-component/home-component';
import { LoginComponent } from './Pages/login-component/login-component';
import { RegisterComponent } from './Pages/register-component/register-component';
import { AuthGuard } from './guards/auth-guard';
import { RoleGuard } from './guards/role-guard-guard';
import { DashboardComponent } from './Pages/Customer/dashboard-component/dashboard-component';
import { FindMechanicComponent } from './Pages/Customer/find-mechanic-component/find-mechanic-component';
import { CustomerCreateRequestComponent } from './Pages/Customer/customer-create-request-component/customer-create-request-component';
import { CustomermyRequestComponent } from './Pages/Customer/customermy-request-component/customermy-request-component';
import { CustomerRequestDetailComponent } from './Pages/Customer/customer-request-detail-component/customer-request-detail-component';
import { MechanicDashboardComponent } from './Pages/Mechanics/mechanic-dashboard-component/mechanic-dashboard-component';
import { MechanicProfileComponent } from './Pages/Mechanics/mechanic-profile-component/mechanic-profile-component';
import { MechanicRequestComponent } from './Pages/Mechanics/mechanic-request-component/mechanic-request-component';
import { MechanicRequestManagementComponent } from './Pages/Mechanics/mechanic-request-management-component/mechanic-request-management-component';
import { guestGuardGuard } from './guards/guest-guard-guard';

export const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [guestGuardGuard] },
  { path: 'login', component: LoginComponent, canActivate: [guestGuardGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [guestGuardGuard] },

  // Customer Routes
  {
    path: 'customer',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Customer'] },
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'find-mechanics', component: FindMechanicComponent },
      { path: 'my-requests', component: CustomermyRequestComponent },
      { path: 'create-request', component: CustomerCreateRequestComponent },
      { path: 'requests/:id', component: CustomerRequestDetailComponent }
    ]
  },

  // Mechanic Routes
  {
    path: 'mechanic',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Mechanic'] },
    children: [
      { path: 'dashboard', component: MechanicDashboardComponent },
      { path: 'profile', component: MechanicProfileComponent },
      { path: 'requests', component: MechanicRequestComponent },
      { path: 'requests/:id', component: MechanicRequestManagementComponent }
    ]
  },

  // Wildcard route
  {
    path: '**',
    redirectTo: ''
  }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
