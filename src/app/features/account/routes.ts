import { Route } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { guestGuard } from "../../core/guards/guest-guard";
import { RegisterComponent } from "./register/register.component";
import { authGuard } from "../../core/guards/auth-guard";
import { UserProfileComponent } from "./user-profile/user-profile.component";
import { UserOrderDetailsComponent } from "./user-profile/user-order-details/user-order-details.component";

export const accountRoutes: Route[] = [
    { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
    { path: 'register', component: RegisterComponent, canActivate: [guestGuard] },
    { path: 'user-profile', component: UserProfileComponent, canActivate: [authGuard] },
    { path: 'user-profile/order/:id', component: UserOrderDetailsComponent, canActivate: [authGuard] },
]