import { Component, inject } from '@angular/core';
import { AdminAuthorService } from '../../../../core/services/admin-services/admin-author.service';
import { SnackbarService } from '../../../../core/services/snackbar.service';
import { BusyService } from '../../../../core/services/busy.service';
import { PaginationParams } from '../../../../shared/models/pagination/paginationParams';
import { Author } from '../../../../shared/models/author';
import { Pagination } from '../../../../shared/models/pagination/pagination';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { DropdownIcon, DropdownOption } from '../../../../shared/models/dropdown/dropDownOptions';
import { LoadingAdminComponent } from "../../../../shared/components/loading-admin/loading-admin.component";
import { DropdownComponent } from "../../../../shared/components/dropdown/dropdown.component";
import { DatePipe } from '@angular/common';
import { AddAuthorComponent } from "./add-author/add-author.component";
import { UpdateAuthorComponent } from "./update-author/update-author.component";

@Component({
  selector: 'app-authors',
  imports: [LoadingAdminComponent, DropdownComponent, MatPaginator, DatePipe, AddAuthorComponent, UpdateAuthorComponent],
  templateUrl: './authors.component.html',
  styleUrl: './authors.component.scss'
})
export class AuthorsComponent {
  private snackbar = inject(SnackbarService);
  private adminAuthorService = inject(AdminAuthorService);
  busyService = inject(BusyService);

  paginationParams = new PaginationParams();
  authors?: Pagination<Author>;

  createAuthorModalOpen = false;
  editAuthorModalOpen = false;
  authorToEdit?: Author;

  ngOnInit(): void {
    this.getAuthorsList();
  }

  getAuthorsList() {
    this.adminAuthorService.getAuthorList(this.paginationParams).subscribe({
      next: response => this.authors = response,
      error: error => console.error('Error fetching authors:', error)
    });
  }

  handlePageEvent(event: PageEvent) {
    this.paginationParams.PageNumber = event.pageIndex + 1;
    this.paginationParams.PageSize = event.pageSize;
    this.getAuthorsList();
  }

  
  getDropDownOptions(author: Author): DropdownOption[] {
    const options: DropdownOption[] = [];

    options.push({
      label: 'Edit',
      action: () => this.openEditAuthorModal(author),
      class: 'text-gray-600',
      iconHover: 'group-hover:text-gray-800',
      icon: DropdownIcon.Edit
    });
    options.push({
      label: 'Delete',
      action: () => this.removeAuthor(author),
      class: 'text-red-600',
      iconHover: 'group-hover:text-red-800',
      icon: DropdownIcon.Trash
    });

    return options;
  }

  openCreateAuthorModal() {
    this.createAuthorModalOpen = true;
  }

  closeCreateAuthorModal() {
    this.createAuthorModalOpen = false;
  }

  onCreateAuthorSaved(author: { name: string }) {
    this.adminAuthorService.addAuthor(author.name).subscribe({
      next: () => {
        this.getAuthorsList();
        this.snackbar.success('Author created successfully!');
      },
      error: (error) => {
        const errorMessage = error?.error?.message || error?.message || 'Failed to create the author';
        this.snackbar.error(errorMessage);
      }
    });
  }

  openEditAuthorModal(author: Author) {
    this.editAuthorModalOpen = true;
    this.authorToEdit = author;
  }

  closeEditAuthorModal() {
    this.editAuthorModalOpen = false;
    this.authorToEdit = undefined;
  }

  onEditAuthorSaved(author: { name: string, authorId: number }) {
    this.adminAuthorService.updateAuthor(author.authorId, author.name).subscribe({
      next: () => {
        this.getAuthorsList();
        this.snackbar.success('Author updated successfully!');
      },
      error: (error) => {
        const errorMessage = error?.error?.message || error?.message || 'Failed to update the author';
        this.snackbar.error(errorMessage);
      }
    });
  }

  removeAuthor(author: Author) {
    this.adminAuthorService.deleteAuthor(author.id).subscribe({
      next: () => {
        this.getAuthorsList();
        this.snackbar.success('Author deleted successfully!');
      },
      error: (error) => {
        const errorMessage = error?.error?.message || error?.message || 'Failed to delete the author';
        this.snackbar.error(errorMessage);
      }
    });
  }

}
