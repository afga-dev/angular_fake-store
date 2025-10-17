import { Routes } from '@angular/router';
import { SigninComponent } from './pages/signin.component/signin.component';
import { ShopComponent } from './pages/shop.component/shop.component';

export const routes: Routes = [
    { path: '', component: ShopComponent },
    { path: 'signin', component: SigninComponent },
    { path: '**', redirectTo: '', pathMatch: 'full' },
];
