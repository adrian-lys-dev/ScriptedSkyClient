import { Route } from "@angular/router";
import { AdminComponent } from "./admin.component";
import { adminGuard } from "../../core/guards/admin-guard";
import { OrdersComponent } from "./orders/orders.component";
import { UsersComponent } from "./users/users.component";
import { BooksComponent } from "./entities-management/books/books.component";
import { AuthorsComponent } from "./entities-management/authors/authors.component";
import { GenresComponent } from "./entities-management/genres/genres.component";
import { PublishersComponent } from "./entities-management/publishers/publishers.component";
import { OrderDetailsComponent } from "./orders/order-details/order-details.component";
import { AddBookComponent } from "./entities-management/books/add-book/add-book.component";
import { UpdateBookComponent } from "./entities-management/books/update-book/update-book.component";
import { BookDetailsComponent } from "./entities-management/books/book-details/book-details.component";

export const adminRoutes: Route[] = [
    { path: '', component: AdminComponent, canActivate: [adminGuard] },
    { path: 'orders', component: OrdersComponent, canActivate: [adminGuard] },
    { path: 'orders/order/:id', component: OrderDetailsComponent, canActivate: [adminGuard] },
    { path: 'users', component: UsersComponent, canActivate: [adminGuard] },
    { path: 'books', component: BooksComponent, canActivate: [adminGuard] },
    { path: 'books/add-book', component: AddBookComponent, canActivate: [adminGuard] },
    { path: 'books/update-book/:id', component: UpdateBookComponent, canActivate: [adminGuard] },
    { path: 'books/:id', component: BookDetailsComponent, canActivate: [adminGuard] },
    { path: 'authors', component: AuthorsComponent, canActivate: [adminGuard] },
    { path: 'genres', component: GenresComponent, canActivate: [adminGuard] },
    { path: 'publishers', component: PublishersComponent, canActivate: [adminGuard] }
]