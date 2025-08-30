import { Component, inject, OnInit } from '@angular/core';
import { SnackbarService } from '../../../core/services/snackbar.service';
import { BusyService } from '../../../core/services/busy.service';
import { AdminUserService } from '../../../core/services/admin-services/admin-user.service';
import { PaginationParams } from '../../../shared/models/pagination/paginationParams';
import { User } from '../../../shared/models/user/user';
import { Pagination } from '../../../shared/models/pagination/pagination';
import { DropdownIcon, DropdownOption } from '../../../shared/models/dropdown/dropDownOptions';
import { LoadingAdminComponent } from "../../../shared/components/loading-admin/loading-admin.component";
import { CommonModule } from '@angular/common';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { DropdownComponent } from "../../../shared/components/dropdown/dropdown.component";
import { AccountService } from '../../../core/services/account.service';

@Component({
  selector: 'app-users',
  imports: [LoadingAdminComponent, CommonModule, MatPaginator, DropdownComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {

  private adminUserService = inject(AdminUserService);
  private snackbar = inject(SnackbarService);
  private accountService = inject(AccountService);
  busyService = inject(BusyService);

  paginationParams = new PaginationParams();
  users?: Pagination<User>;

  loadingRoles = new Set<string>();

  ngOnInit(): void {
    this.getUsersList();
  }

  handlePageEvent(event: PageEvent) {
    this.paginationParams.PageNumber = event.pageIndex + 1;
    this.paginationParams.PageSize = event.pageSize;
    this.getUsersList();
  }

  getUsersList() {
    this.adminUserService.getUserList(this.paginationParams).subscribe({
      next: response => this.users = response,
      error: error => console.error('Error fetching users:', error)
    });
  }
  
  getRoles(user: User): string[] {
    if (!user.roles) return [];
    return Array.isArray(user.roles) ? user.roles : user.roles.split(',');
  }

  getDropDownOptions(user: User): DropdownOption[] {
    const options: DropdownOption[] = [];

    const hasAdminRole = this.getRoles(user).includes('Admin');

    if (hasAdminRole) {
      options.push({
        label: 'Remove Admin',
        action: () => this.removeAdminRole(user),
        class: 'text-red-600',
        iconHover: 'group-hover:text-red-800',
        icon: DropdownIcon.Trash
      });
    } else {
      options.push({
        label: 'Make Admin',
        action: () => this.addAdminRole(user),
        class: 'text-blue-600',
        iconHover: 'group-hover:text-blue-800',
        icon: DropdownIcon.Check
      });
    }

    return options;
  }

  addAdminRole(user: User) {
    this.loadingRoles.add(user.id);
    const roles = this.getRoles(user);
    if (!roles.includes('Admin')) {
      this.adminUserService.addUserRole(user.id, 'Admin').subscribe({
        next: () => {
          this.loadingRoles.delete(user.id);
          roles.push('Admin');
          user.roles = roles;
          this.snackbar.success('Admin role added');
        },
        error: () => {
          this.loadingRoles.delete(user.id);
          this.snackbar.error('Failed to add Admin role')
        }
      })
    }
  }

  removeAdminRole(user: User) {
    if (!this.canModifyAdminRole(user)) return;
    
    this.loadingRoles.add(user.id);
    const roles = this.getRoles(user);
    user.roles = roles.filter(r => r !== 'Admin');

    if (roles.includes('Admin')) {
      this.adminUserService.removeUserRole(user.id, 'Admin').subscribe({
        next: () => {
          this.loadingRoles.delete(user.id);       
          this.snackbar.success('Admin role removed');
        },
        error: () => {
          roles.push('Admin');
          this.loadingRoles.delete(user.id);
          this.snackbar.error('Failed to remove Admin role')
        } 
      });
    }
  }

  private canModifyAdminRole(user: User): boolean {
    const currentUser = this.accountService.currentUser();

    if (currentUser?.id === user.id && this.getRoles(currentUser).includes('Admin')) {
      this.snackbar.error('You cannot modify your own Admin role');
      return false;
    }

    return true;
  }

}
