import { Component, inject, OnInit } from '@angular/core';
import { AdminBookService } from '../../../../core/services/admin-services/admin-book.service';
import { SnackbarService } from '../../../../core/services/snackbar.service';
import { BusyService } from '../../../../core/services/busy.service';
import { PaginationParams } from '../../../../shared/models/pagination/paginationParams';
import { AdminBook } from '../../../../shared/models/admin-book/adminBook';
import { Pagination } from '../../../../shared/models/pagination/pagination';
import { LoadingAdminComponent } from "../../../../shared/components/loading-admin/loading-admin.component";
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { DropdownIcon, DropdownOption } from '../../../../shared/models/dropdown/dropDownOptions';
import { DropdownComponent } from "../../../../shared/components/dropdown/dropdown.component";
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-books',
  imports: [LoadingAdminComponent, MatPaginator, DropdownComponent, RouterLink],
  templateUrl: './books.component.html',
  styleUrl: './books.component.scss'
})
export class BooksComponent implements OnInit {

  private snackbar = inject(SnackbarService);
  private adminBookService = inject(AdminBookService);
  private router = inject(Router);
  busyService = inject(BusyService);

  paginationParams = new PaginationParams();
  books?: Pagination<AdminBook>;

  ngOnInit(): void {
    this.getBooksList();
  }

  handlePageEvent(event: PageEvent) {
    this.paginationParams.PageNumber = event.pageIndex + 1;
    this.paginationParams.PageSize = event.pageSize;
    this.getBooksList();
  }

  getBooksList() {
    this.adminBookService.getBookList(this.paginationParams).subscribe({
      next: response => this.books = response,
      error: error => console.error('Error fetching books:', error)
    });
  }

  getDropDownOptions(book: AdminBook): DropdownOption[] {
    const options: DropdownOption[] = [];

    options.push({
      label: 'Details',
      action: () => this.bookDetails(book),
      class: 'text-gray-600',
      iconHover: 'group-hover:text-gray-800',
      icon: DropdownIcon.Eye
    });
    options.push({
      label: 'Edit',
      action: () => this.editBook(book),
      class: 'text-gray-600',
      iconHover: 'group-hover:text-gray-800',
      icon: DropdownIcon.Edit
    });
    options.push({
      label: 'Delete',
      action: () => this.removeBook(book),
      class: 'text-red-600',
      iconHover: 'group-hover:text-red-800',
      icon: DropdownIcon.Trash
    });

    return options;
  }

  bookDetails(book: AdminBook){
    this.router.navigate(['/admin/books', book.id]);
  }

  editBook(book: AdminBook) {
    this.router.navigate(['/admin/books/update-book', book.id]);
  }

  removeBook(book: AdminBook) {
    const confirmed = window.confirm(`Are you sure you want to delete the book "${book.title}"?`);
    if (!confirmed) {
      return;
    }

    this.adminBookService.deleteBook(book.id).subscribe({
      next: () => {
        this.getBooksList();
        this.snackbar.success('Book deleted successfully!');
      },
      error: (error) => {
        const errorMessage = error?.error?.message || error?.message || 'Failed to delete the book';
        this.snackbar.error(errorMessage);
      }
    });
  }

}
