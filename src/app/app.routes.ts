import { Routes } from '@angular/router';
import { SigninComponent } from './pages/signin.component/signin.component';

export const routes: Routes = [
    { path: 'signin', component: SigninComponent },
    { path: '**', redirectTo: '', pathMatch: 'full' },
];
