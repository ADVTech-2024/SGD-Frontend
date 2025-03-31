import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { UserManagementComponent } from './pages/user-management/user-management.component';
import { DemandsComponent } from './pages/demands/demands.component';
import { AuthGuard } from './core/guards/auth/auth.guard';
import { OverviewComponent } from './pages/overview/overview.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },

  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'overview', component: OverviewComponent },
      { path: 'demands', component: DemandsComponent },
      { path: 'user-management', component: UserManagementComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  { path: '**', redirectTo: 'dashboard' }
];
