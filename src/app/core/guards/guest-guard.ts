import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AccountService } from '../services/account.service';
import { of } from 'rxjs';

export const guestGuard: CanActivateFn = (route, state) => {
  const accountService = inject(AccountService);
  const router = inject(Router);

  if (!accountService.currentUser()) {
    return of(true);
  } else {
    router.navigate(['/']);
    return of(false);
  }
};
