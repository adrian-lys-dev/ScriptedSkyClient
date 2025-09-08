import { Component, inject, OnInit } from '@angular/core';
import { AdminBookService } from '../../../../../core/services/admin-services/admin-book.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BusyService } from '../../../../../core/services/busy.service';
import { BookDetails } from '../../../../../shared/models/admin-book/book-details';
import { LoadingAdminComponent } from "../../../../../shared/components/loading-admin/loading-admin.component";
import { TextInputComponent } from "../../../../../shared/components/text-input/text-input.component";
import { MultiSelectComponent } from "../../../../../shared/components/multi-select/multi-select.component";
import { ImageUploadComponent } from "../../../../../shared/components/image-upload/image-upload.component";
import { SingleSelectComponent } from "../../../../../shared/components/single-select/single-select.component";
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { PictureValidator } from '../../../../../core/validators/pictureValidator';
import { FilteringItems } from '../../../../../shared/models/filteringItems';
import { ShopService } from '../../../../../core/services/shop.service';
import { combineLatest } from 'rxjs';
import { SnackbarService } from '../../../../../core/services/snackbar.service';

@Component({
  selector: 'app-update-book',
  imports: [ReactiveFormsModule, LoadingAdminComponent, TextInputComponent, MultiSelectComponent, ImageUploadComponent, SingleSelectComponent],
  templateUrl: './update-book.component.html',
  styleUrl: './update-book.component.scss'
})
export class UpdateBookComponent implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private adminBookService = inject(AdminBookService);
  private shopService = inject(ShopService);
  private snackbar = inject(SnackbarService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  busyService = inject(BusyService);

  genres: FilteringItems[] = [];
  authors: FilteringItems[] = [];
  publishers: FilteringItems[] = [];

  selectedGenres: FilteringItems[] = [];
  selectedAuthors: FilteringItems[] = [];

  book?: BookDetails;

  bookForm = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(256)]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    releaseYear: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(1),
      Validators.max(2100)
    ]),
    pageNumber: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(1)
    ]),
    price: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(0.01),
      Validators.max(999999.99)
    ]),
    isbn: ['', [Validators.required, Validators.minLength(13), Validators.maxLength(13)]],
    quantityInStock: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(0)
    ]),
    genresIds: new FormControl<number[]>([], [Validators.required]),
    authorsIds: new FormControl<number[]>([], [Validators.required]),
    publisherId: new FormControl<number | null>(null, [Validators.required]),
    picture: new FormControl<File | null>(null, [
      PictureValidator.fileExtensionValidator(['jpg', 'jpeg', 'png']),
      PictureValidator.fileSizeValidator(10 * 1024 * 1024)
    ])
  });

  ngOnInit(): void {
    combineLatest([
      this.shopService.getGenres(),
      this.shopService.getAuthors(),
      this.shopService.getPublishers()
    ]).subscribe({
      next: ([genres, authors, publishers]) => {
        this.genres = genres;
        this.authors = authors;
        this.publishers = publishers;
        this.loadBook();
      },
      error: err => console.error('Error loading filters:', err)
    });
  }

  loadBook() {
    const id = this.bookId;
    if (!id) return;

    this.adminBookService.getBookById(id).subscribe({
      next: book => {
        this.book = book;

        this.selectedGenres = book.genre.map(g => ({ id: g.id, name: g.name }));
        this.selectedAuthors = book.author.map(a => ({ id: a.id, name: a.name }));

        this.bookForm.patchValue({
          title: book.title,
          description: book.description,
          releaseYear: book.releaseYear,
          pageNumber: book.pageNumber,
          price: book.price,
          isbn: book.isbn,
          quantityInStock: book.quantityInStock,
          genresIds: this.selectedGenres.map(g => g.id),
          authorsIds: this.selectedAuthors.map(a => a.id),
          publisherId: book.publisher?.id ?? null,
          picture: null 
        });

        const pictureControl = this.bookForm.get('picture');
        if (pictureControl) {
          pictureControl.setValidators([
            PictureValidator.requiredWithExisting(book.pictureURL),
            PictureValidator.fileExtensionValidator(['jpg','jpeg','png']),
            PictureValidator.fileSizeValidator(10 * 1024 * 1024)
          ]);
          pictureControl.updateValueAndValidity();
        }
      },
      error: error => console.error('Error loading book:', error)
    });
  }

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
        if (typeof value === 'number') {
          formData.append(key, value.toString().replace('.', ','));
        } else {
          formData.append(key, value.toString());
        }
      }
    }

    if (!this.book?.id) {
      this.snackbar.error("Book ID is missing");
      return;
    }

    this.adminBookService.updateBook(formData, this.book.id).subscribe({
      next: () => {
        this.snackbar.success('Book updated successfully!');
        this.router.navigate(['/admin/books']);
      },
      error: (error) => {
        const errorMessage = error?.error?.message || error?.message || 'Failed to update the book';
        this.snackbar.error(errorMessage);
      }
    });
  }

  private get bookId(): number | null {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    return id ? +id : null;
  }
}
