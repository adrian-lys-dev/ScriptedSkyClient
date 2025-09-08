import { Component, inject, OnInit } from '@angular/core';
import { BookDetails } from '../../../../../shared/models/admin-book/book-details';
import { ActivatedRoute } from '@angular/router';
import { AdminBookService } from '../../../../../core/services/admin-services/admin-book.service';
import { BusyService } from '../../../../../core/services/busy.service';
import { DatePipe } from '@angular/common';
import { LoadingAdminComponent } from "../../../../../shared/components/loading-admin/loading-admin.component";

@Component({
  selector: 'app-book-details',
  imports: [DatePipe, LoadingAdminComponent],
  templateUrl: './book-details.component.html',
  styleUrl: './book-details.component.scss'
})
export class BookDetailsComponent implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private adminBookService = inject(AdminBookService);
  busyService = inject(BusyService);

  book?: BookDetails;

  ngOnInit(): void {
    this.loadBook();
  }

  loadBook() {
    const id = this.bookId;
    if (!id) return;
    this.adminBookService.getBookById(id).subscribe({
      next: book => {
        this.book = book
      },
      error: error => console.error('Error loading book:', error)
    });
  }

  private get bookId(): number | null {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    return id ? +id : null;
  }

}
