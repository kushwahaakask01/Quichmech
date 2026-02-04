import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { DatePipe } from "@angular/common"

import { AppRoutingModule, routes } from './app-routing-module';
import { App } from './app';
import { LoginComponent } from './Pages/login-component/login-component';
import { RegisterComponent } from './Pages/register-component/register-component';
import { NavbarComponent } from './Pages/navbar-component/navbar-component';
import { HomeComponent } from './Pages/home-component/home-component';
import { DashboardComponent } from './Pages/Customer/dashboard-component/dashboard-component';
import { FindMechanicComponent } from './Pages/Customer/find-mechanic-component/find-mechanic-component';
import { CustomermyRequestComponent } from './Pages/Customer/customermy-request-component/customermy-request-component';
import { CustomerRequestDetailComponent } from './Pages/Customer/customer-request-detail-component/customer-request-detail-component';
import { CustomerCreateRequestComponent } from './Pages/Customer/customer-create-request-component/customer-create-request-component';
import { MechanicDashboardComponent } from './Pages/Mechanics/mechanic-dashboard-component/mechanic-dashboard-component';
import { MechanicProfileComponent } from './Pages/Mechanics/mechanic-profile-component/mechanic-profile-component';
import { MechanicRequestComponent } from './Pages/Mechanics/mechanic-request-component/mechanic-request-component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './interceptors/auth-interceptor';
import { MechanicRequestManagementComponent } from './Pages/Mechanics/mechanic-request-management-component/mechanic-request-management-component';
import { LoadingSpinnerComponent } from './Pages/Shared/loading-spinner-component/loading-spinner-component';
import { ErrorMessageComponent } from './Pages/Shared/error-message-component/error-message-component';
import { ReveiwFormComponent } from './Pages/Shared/reveiw-form-component/reveiw-form-component';
import { StatusBadgeComponentComponent } from './Pages/Shared/status-badge-component-component/status-badge-component-component';
import { MechanicCardComponent } from './Pages/Shared/mechanic-card-component/mechanic-card-component';
import { RatingStarsComponent } from './Pages/Shared/rating-stars-component/rating-stars-component';


@NgModule({
  declarations: [
    App,
    LoginComponent,
    RegisterComponent,
    NavbarComponent,
    HomeComponent,
    DashboardComponent,
    FindMechanicComponent,
    CustomermyRequestComponent,
    CustomerRequestDetailComponent,
    CustomerCreateRequestComponent,
    MechanicDashboardComponent,
    MechanicProfileComponent,
    MechanicRequestComponent,
    MechanicRequestManagementComponent,
    LoadingSpinnerComponent,
    ErrorMessageComponent,
    ReveiwFormComponent,
    StatusBadgeComponentComponent,
    MechanicCardComponent,
    RatingStarsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    RouterModule
  ],
  providers: [
    provideHttpClient(withInterceptors([authInterceptor]))
  ],
  bootstrap: [App]
})
export class AppModule { }



