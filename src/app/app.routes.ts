import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { ShopComponent } from './features/shop/shop.component';
import { TestErrorComponent } from './features/test-error/test-error.component';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { ServerErrorComponent } from './shared/components/server-error/server-error.component';
import { BookDetailComponent } from './features/shop/book-detail/book-detail.component';
import { CartComponent } from './features/cart/cart.component';
import { ContactsComponent } from './features/contacts/contacts.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'contacts', component: ContactsComponent },
  { path: 'shop', component: ShopComponent },
  { path: 'shop/:id', component: BookDetailComponent },
  { path: 'cart', component: CartComponent },
  { path: 'checkout', loadChildren: () => import('./features/checkout/routes').then(r => r.checkoutRoutes)},
  { path: 'account', loadChildren: () => import('./features/account/routes').then(r => r.accountRoutes)},
  { path: 'admin', loadChildren: () => import('./features/admin/routes').then(r => r.adminRoutes)},
  { path: 'test-error', component: TestErrorComponent },
  { path: 'not-found', component: NotFoundComponent },
  { path: 'server-error', component: ServerErrorComponent },
  { path: '**', redirectTo: 'not-found', pathMatch: 'full' }
];
