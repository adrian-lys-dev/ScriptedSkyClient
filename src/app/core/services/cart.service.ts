import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Book } from '../../shared/models/book';
import { map } from 'rxjs';
import { Cart, CartItem } from '../../shared/models/cart/cart';
import { CatalogBook } from '../../shared/models/catalogBook';
import { DeliveryMethods } from '../../shared/models/order/deliveryMethods';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);
  cart = signal<Cart | null>(null);
  loading = signal(false);

  itemCount = computed(() => {
    return this.cart()?.items.reduce((sum, item) => sum + item.quantity, 0)
  });
  selectedDeliveryMethod = signal<DeliveryMethods | null>(null);
  
  totals = computed(() => {
    const cart = this.cart();
    const delivery = this.selectedDeliveryMethod()

    if (!cart) return null;

    const subtotalRaw = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = delivery ? delivery.price : 0;
    const discount = 0;

    const subtotal = Number(subtotalRaw.toFixed(2));
    const total = Number((subtotal + shipping - discount).toFixed(2));

    return {
      subtotal,
      shipping,
      discount,
      total
    };
  });


  getCart(id: string) {
    return this.http.get<Cart>(this.baseUrl + 'cart?id=' + id).pipe(
      map(cart => {
        this.cart.set(cart);
        return cart;
      })
    )
  }

  setCart(cart: Cart) {
    return this.http.post<Cart>(this.baseUrl + 'cart', cart).subscribe({
      next: cart => this.cart.set(cart)
    })
  }

  addItemToCart(item: CartItem | CatalogBook | Book, quantity = 1) {    
    const cart = this.cart() ?? this.createCart()
    if (this.isCatalogBook(item)) {
      item = this.mapCatalogBookToCartItem(item);
    } else if (this.isBook(item)) {
      item = this.mapBookToCartItem(item);
    }
    cart.items = this.addOrUpdateItem(cart.items, item, quantity);
    this.setCart(cart);
  }

  removeItemFromCart(bookId: number, quantity = 1) {
    const cart = this.cart();
    if (!cart) return;

    const index = cart.items.findIndex(x => x.bookId === bookId);
    if (index !== -1) {
      if (cart.items[index].quantity > quantity) {
        cart.items[index].quantity -= quantity;
      } else {
        cart.items.splice(index, 1);
      }

      if (cart.items.length === 0) {
        this.deleteCart();
      } else {
        this.setCart(cart);
      }
    }
  }

  deleteCart() {
    this.http.delete(this.baseUrl + 'cart?id=' + this.cart()?.id).subscribe({
      next: () => {
        localStorage.removeItem('cart_id');
        this.cart.set(null);
      }
    })
  }

  private addOrUpdateItem(items: CartItem[], item: CartItem, quantity: number): CartItem[] {    
    const index = items.findIndex(x => x.bookId === item.bookId);
    if (index === -1) {
      item.quantity = quantity;
      items.push(item);      
    } else {
      items[index].quantity += quantity      
    }

    return items;
  }

  private isCatalogBook(item: any): item is CatalogBook {
    return (item as CatalogBook).authorNames !== undefined;
  }


  private isBook(item: any): item is Book {
    return (item as Book).id !== undefined;
  }

  private mapCatalogBookToCartItem(item: CatalogBook): CartItem {
    return {
      bookId: item.id,
      bookName: item.title,
      authorName: item.authorNames,
      price: item.price,
      quantity: 0,
      pictureURL: item.pictureURL
    }
  }

  private mapBookToCartItem(item: Book): CartItem {
    return {
      bookId: item.id,
      bookName: item.title,
      authorName: item.author.map(a => a.name).join(', '),
      price: item.price,
      quantity: 0,
      pictureURL: item.pictureURL
    };
  }


  private createCart(): Cart {
    const cart = new Cart();
    localStorage.setItem('cart_id', cart.id);
    return cart;
  }

}