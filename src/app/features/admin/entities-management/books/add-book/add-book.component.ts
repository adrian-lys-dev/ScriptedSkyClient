import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { TextInputComponent } from '../../../../../shared/components/text-input/text-input.component';
import { FilteringItems } from '../../../../../shared/models/filteringItems';
import { ShopService } from '../../../../../core/services/shop.service';
import { CommonModule } from '@angular/common';
import { MultiSelectComponent } from "../../../../../shared/components/multi-select/multi-select.component";
import { SingleSelectComponent } from "../../../../../shared/components/single-select/single-select.component";
import { PictureValidator } from '../../../../../core/validators/pictureValidator';
import { ImageUploadComponent } from "../../../../../shared/components/image-upload/image-upload.component";
import { AdminBookService } from '../../../../../core/services/admin-services/admin-book.service';
import { SnackbarService } from '../../../../../core/services/snackbar.service';
import { Router } from '@angular/router';
import { LoadingAdminComponent } from "../../../../../shared/components/loading-admin/loading-admin.component";
import { BusyService } from '../../../../../core/services/busy.service';

@Component({
  selector: 'app-add-book',
  imports: [ReactiveFormsModule, TextInputComponent, CommonModule, MultiSelectComponent, SingleSelectComponent, ImageUploadComponent, LoadingAdminComponent],
  templateUrl: './add-book.component.html',
  styleUrl: './add-book.component.scss'
})
export class AddBookComponent implements OnInit {

  private snackbar = inject(SnackbarService);
  private fb = inject(FormBuilder);
  private shopService = inject(ShopService);
  private adminBookService = inject(AdminBookService);
  private router = inject(Router);
  busyService = inject(BusyService);
  
  genres: FilteringItems[] = [];
  authors: FilteringItems[] = [];
  publishers: FilteringItems[] = [];

  selectedGenres: FilteringItems[] = [];
  selectedAuthors: FilteringItems[] = [];

  ngOnInit(): void {
    this.getFilteringItems();
  }

  bookForm = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(256)]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    releaseYear: [null, [Validators.required, Validators.min(1), Validators.max(2100)]],
    pageNumber: [null, [Validators.required, Validators.min(1)]],
    price: [null, [Validators.required, Validators.min(0.01), Validators.max(999999.99)]],
    isbn: ['', [Validators.required, Validators.minLength(13), Validators.maxLength(13)]],
    quantityInStock: [null, [Validators.required, Validators.min(0)]],
    genresIds: new FormControl<number[]>([], [Validators.required]),
    authorsIds: new FormControl<number[]>([], [Validators.required]),
    publisherId: [null, [Validators.required]],
    picture: new FormControl(null as File | null, [
      Validators.required,
      PictureValidator.fileExtensionValidator(['jpg', 'jpeg', 'png']),
      PictureValidator.fileSizeValidator(10 * 1024 * 1024)
    ]),
  });

  submitBook(): void {
    if (this.bookForm.invalid) {
      this.bookForm.markAllAsTouched();
      return;
    }

    const formData = new FormData();
    const controls = this.bookForm.controls;

    for (const key of Object.keys(controls) as (keyof typeof controls)[]) {
      const value = controls[key].value;

      if (value instanceof File) {
        formData.append(key, value);
      } else if (Array.isArray(value)) {
        if (key === 'genresIds') {
          value.forEach(v => formData.append('GenreIds', v.toString()));
        } else if (key === 'authorsIds') {
          value.forEach(v => formData.append('AuthorIds', v.toString()));
        } else {
          value.forEach(v => formData.append(key, v.toString()));
        }
      } else if (value !== null && value !== undefined) {
        formData.append(key, value.toString());
      }
    }

    this.adminBookService.createBook(formData).subscribe({
      next: () => {
        this.snackbar.success('Book created successfully!');
        this.router.navigate(['/admin/books']);
      },
      error: (error) => {
        const errorMessage = error?.error?.message || error?.message || 'Failed to create the book';
        this.snackbar.error(errorMessage);
      }
    });
  }

  getFilteringItems() {
    this.getGenreForFilter();
    this.getAuthorForFilter();
    this.getPublisherForFilter();
  }

  getGenreForFilter() {
    this.shopService.getGenres().subscribe({
      next: response => this.genres = response,
      error: error => console.log(error)
    });
  }

  getAuthorForFilter() {
    this.shopService.getAuthors().subscribe({
      next: response => this.authors = response,
      error: error => console.log(error)
    });
  }

  getPublisherForFilter() {
    this.shopService.getPublishers().subscribe({
      next: response => this.publishers = response,
      error: error => console.log(error)
    });
  }

}
