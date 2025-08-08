import { Component, inject, OnInit } from '@angular/core';
import { ShopService } from '../../../core/services/shop.service';
import { ActivatedRoute } from '@angular/router';
import { Book } from '../../../shared/models/book';
import { BusyService } from '../../../core/services/busy.service';
import { CartService } from '../../../core/services/cart.service';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-book-detail',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './book-detail.component.html',
  styleUrl: './book-detail.component.scss'
})
export class BookDetailComponent implements OnInit {

  private shopService = inject(ShopService);
  private activatedRoute = inject(ActivatedRoute);
  private cartService = inject(CartService);
  busyService = inject(BusyService);

  private fb = inject(FormBuilder);

  book?: Book;
  quantityInCart = 0;
  quantity = 1;
  rating = 0;
  hoverRating = 0;

  readonly stars = [0, 1, 2, 3, 4];

  reviewForm = this.fb.group({
    review: ['', [Validators.required, Validators.maxLength(800)]],
    rating: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
  });

  ngOnInit(): void {
    this.loadBook();
  }

  loadBook() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (!id) return;
    this.shopService.getBook(+id).subscribe({
      next: book => this.book = book,
      error: error => console.error('Error loading book:', error)
    });
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
  submitReview() {
    if (this.reviewForm.invalid) {
      this.reviewForm.markAllAsTouched();
      return;
    }

    const reviewValue = this.reviewForm.value.review;
    console.log(this.reviewForm.value);

    this.setRating(0);
    this.reviewForm.reset();
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

  get reviewLength(): number {
    return this.reviewForm.get('review')?.value?.length ?? 0;
  }
}
