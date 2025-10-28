import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user.service';

export const authenticationGuard: CanActivateFn = (route, state) => {
  const user = inject(UserService);
  const router = inject(Router);

  if (user.isAuthenticated()) {
    return true;
  } else {
    router.navigate(['/signin'], { queryParams: { returnUrl: state.url } });
    return false;
  }
};
