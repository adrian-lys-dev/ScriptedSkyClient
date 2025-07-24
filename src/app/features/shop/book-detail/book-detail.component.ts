import { Component, inject, OnInit } from '@angular/core';
import { ShopService } from '../../../core/services/shop.service';
import { ActivatedRoute } from '@angular/router';
import { Book } from '../../../shared/models/book';
import { DatePipe } from '@angular/common';
import { BusyService } from '../../../core/services/busy.service';
import { CartService } from '../../../core/services/cart.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-book-detail',
  imports: [DatePipe, FormsModule],
  templateUrl: './book-detail.component.html',
  styleUrl: './book-detail.component.scss'
})
export class BookDetailComponent implements OnInit {

  private shopService = inject(ShopService);
  private activatedRoute = inject(ActivatedRoute);
  private cartService = inject(CartService);
  busyService = inject(BusyService);
  
  book?: Book;
  quantityInCart = 0;
  quantity = 1;

  readonly stars = [0, 1, 2, 3, 4];

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

  updateCart() {
    if(!this.book) return;
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
}
