import { Route } from "@angular/router";
import { AdminComponent } from "./admin.component";
import { adminGuard } from "../../core/guards/admin-guard";

export const adminRoutes: Route[] = [
    { path: '', component: AdminComponent, canActivate: [adminGuard] }
]