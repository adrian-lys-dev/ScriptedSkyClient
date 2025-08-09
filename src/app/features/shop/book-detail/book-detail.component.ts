import { Component, inject, OnInit } from '@angular/core';
import { ShopService } from '../../../core/services/shop.service';
import { ActivatedRoute } from '@angular/router';
import { Book } from '../../../shared/models/book';
import { BusyService } from '../../../core/services/busy.service';
import { CartService } from '../../../core/services/cart.service';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PaginationParams } from '../../../shared/models/pagination/paginationParams';
import { Pagination } from '../../../shared/models/pagination/pagination';
import { Review } from '../../../shared/models/review/review';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ReviewService } from '../../../core/services/review.service';
import { AccountService } from '../../../core/services/account.service';
import { ReviewDto } from '../../../shared/models/review/reviewDto';
import { SnackbarService } from '../../../core/services/snackbar.service';
import { EditReviewComponent } from "./edit-review/edit-review.component";

@Component({
  selector: 'app-book-detail',
  imports: [FormsModule, ReactiveFormsModule, CommonModule, MatPaginator, EditReviewComponent],
  templateUrl: './book-detail.component.html',
  styleUrl: './book-detail.component.scss'
})
export class BookDetailComponent implements OnInit {

  private shopService = inject(ShopService);
  private cartService = inject(CartService);
  private reviewService = inject(ReviewService);
  private snackbar = inject(SnackbarService);

  private activatedRoute = inject(ActivatedRoute);
  private fb = inject(FormBuilder);

  accountService = inject(AccountService);
  busyService = inject(BusyService);

  editReviewModalOpen = false;
  reviewToEdit?: Review;

  book?: Book;
  quantityInCart = 0;
  quantity = 1;
  rating = 0;
  hoverRating = 0;

  paginationParams = new PaginationParams();
  reviews?: Pagination<Review>;

  ReviewLoading = false;

  readonly stars = [0, 1, 2, 3, 4];

  reviewForm = this.fb.group({
    review: ['', [Validators.required, Validators.maxLength(800)]],
    rating: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
  });

  ngOnInit(): void {
    this.loadBook();
    this.loadReviews()
  }

  private get bookId(): number | null {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    return id ? +id : null;
  }

  loadBook() {
    const id = this.bookId;
    if (!id) return;
    this.shopService.getBook(id).subscribe({
      next: book => this.book = book,
      error: error => console.error('Error loading book:', error)
    });
  }

  loadReviews() {
    const id = this.bookId;
    if (!id) return;
    this.reviewService.getBookReviews(this.paginationParams, id).subscribe({
      next: response => {
        this.reviews = response,
        this.ReviewLoading = false;
      },
      error: error => {
        console.error('Error fetching reviews:', error),
        this.ReviewLoading = false;
      }
    });
    
  }

  handlePageEvent(event: PageEvent) {
    this.paginationParams.PageNumber = event.pageIndex + 1;
    this.paginationParams.PageSize = event.pageSize;
    this.loadReviews();
  }

  // Cart
  updateCart() {
    if (!this.book) return;
    if (this.quantity > this.quantityInCart) {
      const itemsToAdd = this.quantity - this.quantityInCart;
      this.quantityInCart += itemsToAdd;
      this.cartService.addItemToCart(this.book, itemsToAdd);
    } else {
      const itemsToRemove = this.quantityInCart - this.quantity;
      this.quantityInCart -= itemsToRemove;
      this.cartService.removeItemFromCart(this.book.id, itemsToRemove);
    }
  }

  updateQuantity() {
    this.quantityInCart = this.cartService.cart()?.items
      .find(item => item.bookId === this.book?.id)?.quantity || 0;
  }

  getButtonText() {
    return this.quantityInCart ? 'Update Cart' : 'Add to Cart';
  }

  // Rating and Review
  openEditReviewModal(review: Review) {
    this.reviewToEdit = review;
    this.editReviewModalOpen = true;
  }

  closeEditReviewModal() {
    this.editReviewModalOpen = false;
    this.reviewToEdit = undefined;
  }

  onEditReviewSaved(updatedData: { rating: number; reviewText: string; reviewId?: number }) {

    this.ReviewLoading = true;

    const review: ReviewDto = {
      reviewText: updatedData.reviewText,
      rating: updatedData.rating,
      bookId: this.bookId!,
      userId: this.accountService.currentUser()?.id!
    };

    this.reviewService.updateReview(review, updatedData.reviewId!).subscribe({
      next: () => {
        this.loadReviews();
        this.updateBookRating();
        this.snackbar.success('Review saved successfully. Thank you for sharing your updated opinion!');
      },
      error: (error) => {
        this.snackbar.error('Failed to update the review');
        this.ReviewLoading = false;
      }
    });
  }

  submitReview() {
    if (this.reviewForm.invalid) {
      this.reviewForm.markAllAsTouched();
      return;
    }

    this.ReviewLoading = true;

    const review: ReviewDto = {
      reviewText: this.reviewForm.value.review!,
      rating: this.reviewForm.value.rating!,
      bookId: this.bookId!,
      userId: this.accountService.currentUser()?.id!
    };

    this.reviewService.postReview(review).subscribe({
      next: () => {
        this.setRating(0);
        this.reviewForm.reset();
        this.loadReviews();
        this.updateBookRating();
        
        this.snackbar.success('Thanks for sharing your thoughts! The book thanks you too :)');
      },
      error: (error) => {
        this.ReviewLoading = false;
        this.snackbar.error('Failed to create the review');
      }
    })
  }

  deleteReview(id: number) {
    this.ReviewLoading = true;
    this.reviewService.deleteReview(id).subscribe({
      next: () => {
        this.loadReviews();
        this.updateBookRating();
        this.snackbar.success('Review deleted successfully!');
      },
      error: error => {
        this.snackbar.error('Failed to delete the review!');
        this.ReviewLoading = false;
      }
    })
  }

  setRating(value: number) {
    this.rating = value;
    this.reviewForm.patchValue({ rating: value });
  }

  setHover(value: number) {
    this.hoverRating = value;
  }

  clearHover() {
    this.hoverRating = 0;
  }

  updateBookRating() {
    if (!this.bookId || !this.book) return;

    this.shopService.getBookRating(this.bookId).subscribe({
      next: rating => this.book!.rating = rating
    });
  }

  get reviewLength(): number {
    return this.reviewForm.get('review')?.value?.length ?? 0;
  }
}
