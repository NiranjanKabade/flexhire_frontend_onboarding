import { Routes } from '@angular/router';
import { DefaultLayoutComponent } from './common/default-layout/default-layout.component';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { CompanyInfoComponent } from './pages/company-info/company-info.component';
import { ContactInfoComponent } from './pages/contact-info/contact-info.component';
import { CompanyDocumentationComponent } from './pages/company-documentation/company-documentation.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'forgot-password', component:ForgotPasswordComponent},
    { path: 'reset-password', component: ResetPasswordComponent},
    {
        path: '',
        component: DefaultLayoutComponent,
        children: [
          
          {path: 'dashboard', component: DashboardComponent,canActivate: [authGuard]},
          { path: 'company-info', component:CompanyInfoComponent,canActivate: [authGuard]},
          { path: 'contact-info', component:ContactInfoComponent,canActivate: [authGuard]},
          { path: 'company-document', component:CompanyDocumentationComponent,canActivate: [authGuard]},

        ],
      },
];
