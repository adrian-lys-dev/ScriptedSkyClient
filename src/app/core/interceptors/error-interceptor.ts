import { HttpErrorResponse, HttpEvent, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { SnackbarService } from '../services/snackbar.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const snackbar = inject(SnackbarService);
  
  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 400) {
        if (err.error?.errors) {
          console.log(err.error.errors);      
          return throwError(() => err);
        } else if (typeof err.error === 'string') {
          snackbar.error(err.error);
          return throwError(() => err);
        } else if (err.error?.message) {
          snackbar.error(err.error.message);
          return throwError(() => err);
        }
      }
      
      if (err.status === 401) {
        snackbar.error(err.error?.message || 'Unauthorized');
      }

      if (err.status === 403) {
        snackbar.error('Forbidden');
      }

      if (err.status === 404) {
        router.navigateByUrl('/not-found');
      }

      if (err.status === 500) {
        const navigationExtras: NavigationExtras = { state: { error: err.error } };
        router.navigateByUrl('/server-error', navigationExtras);
      }

      return throwError(() => err);
    })
  );
};
