import { Route } from "@angular/router";
import { AdminComponent } from "./admin.component";
import { adminGuard } from "../../core/guards/admin-guard";
import { OrdersComponent } from "./orders/orders.component";
import { UsersComponent } from "./users/users.component";
import { BooksComponent } from "./entities-management/books/books.component";
import { AuthorsComponent } from "./entities-management/authors/authors.component";
import { GenresComponent } from "./entities-management/genres/genres.component";
import { PubslihersComponent } from "./entities-management/pubslihers/pubslihers.component";
import { OrderDetailsComponent } from "./orders/order-details/order-details.component";

export const adminRoutes: Route[] = [
    { path: '', component: AdminComponent, canActivate: [adminGuard] },
    { path: 'orders', component: OrdersComponent, canActivate: [adminGuard] },
    { path: 'orders/order/:id', component: OrderDetailsComponent, canActivate: [adminGuard] },
    { path: 'users', component: UsersComponent, canActivate: [adminGuard] },
    { path: 'books', component: BooksComponent, canActivate: [adminGuard] },
    { path: 'authors', component: AuthorsComponent, canActivate: [adminGuard] },
    { path: 'genres', component: GenresComponent, canActivate: [adminGuard] },
    { path: 'publishers', component: PubslihersComponent, canActivate: [adminGuard] }
]