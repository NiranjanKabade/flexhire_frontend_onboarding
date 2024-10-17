import { Routes } from '@angular/router';
import { DefaultLayoutComponent } from './common/default-layout/default-layout.component';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'forgot-password', component:ForgotPasswordComponent},
    { path: 'reset-password', component: ResetPasswordComponent},
    {
        path: '',
        component: DefaultLayoutComponent,
        children: [
          
          {path: 'dashboard', component: DashboardComponent},

        ],
      },
];
