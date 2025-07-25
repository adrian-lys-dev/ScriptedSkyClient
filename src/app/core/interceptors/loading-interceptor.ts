import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize, delay } from 'rxjs';
import { BusyService } from '../services/busy.service';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const busyService = inject(BusyService);

  // Skip loading for cart requests
  // This is to prevent loading spinner when adding/removing items from the cart
  if (req.url.includes('/cart') || req.url.includes('/buggy')) {
    return next(req).pipe(
      finalize(() => busyService.idle())
    );
  }

  // Show loading spinner
  busyService.busy();

  // Simulate a delay for loading spinner
  return next(req).pipe(
    delay(800),
    finalize(() => busyService.idle())
  );
};
