import { Component, inject, Input } from '@angular/core';
import { CatalogBook } from '../../../shared/models/catalogBook';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-book-item',
  imports: [RouterLink],
  templateUrl: './book-item.component.html',
  styleUrl: './book-item.component.scss'
})
export class BookItemComponent {
  @Input() book?: CatalogBook;

  cartService = inject(CartService);
}
