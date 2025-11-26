import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { toObservable } from '@angular/core/rxjs-interop';
import { firstValueFrom, filter } from 'rxjs';
import { UserService } from '../services/user.service';

export const guestGuard: CanActivateFn = async () => {
  const user = inject(UserService);
  const router = inject(Router);

  const isLoaded$ = toObservable(user.isLoaded);

  await firstValueFrom(isLoaded$.pipe(filter((loaded) => loaded === true)));

  const isAuth =
    typeof user.isAuthenticated === 'function'
      ? user.isAuthenticated()
      : user.isAuthenticated;

  if (isAuth) {
    return router.parseUrl('/');
  }

  return true;
};
