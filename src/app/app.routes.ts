import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { ShopComponent } from './features/shop/shop.component';
import { TestErrorComponent } from './features/test-error/test-error.component';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { ServerErrorComponent } from './shared/components/server-error/server-error.component';
import { BookDetailComponent } from './features/shop/book-detail/book-detail.component';
import { CartComponent } from './features/cart/cart.component';
import { CheckoutComponent } from './features/checkout/checkout.component';
import { LoginComponent } from './features/account/login/login.component';
import { RegisterComponent } from './features/account/register/register.component';
import { authGuard } from './core/guards/auth-guard';
import { guestGuard } from './core/guards/guest-guard';
import { UserProfileComponent } from './features/account/user-profile/user-profile.component';
import { CheckoutSuccessComponent } from './features/checkout/checkout-success/checkout-success.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'shop', component: ShopComponent },
  { path: 'shop/:id', component: BookDetailComponent },
  { path: 'cart', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent, canActivate: [authGuard] },
  { path: 'checkout/checkout-success', component: CheckoutSuccessComponent, canActivate: [authGuard] },
  { path: 'account/login', component: LoginComponent, canActivate: [guestGuard] },
  { path: 'account/register', component: RegisterComponent, canActivate: [guestGuard] },
  { path: 'account/user-profile', component: UserProfileComponent, canActivate: [authGuard] },
  { path: 'test-error', component: TestErrorComponent },
  { path: 'not-found', component: NotFoundComponent },
  { path: 'server-error', component: ServerErrorComponent },
  { path: '**', redirectTo: 'not-found', pathMatch: 'full' }
];
