import { Routes } from '@angular/router';
import { ShopComponent } from './pages/shop.component/shop.component';
import { guestGuard } from './core/guards/guest-guard';

export const routes: Routes = [
  { path: '', component: ShopComponent },
  {
    path: 'signin',
    loadComponent: () =>
      import('./pages/signin.component/signin.component').then(
        (c) => c.SigninComponent
      ),
    canActivate: [guestGuard],
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
