import { Component, inject, OnInit } from '@angular/core';
import { ShopService } from '../../core/services/shop.service';
import { CatalogBook } from '../../shared/models/catalogBook';
import { BookItemComponent } from './book-item/book-item.component';
import { Pagination } from '../../shared/models/pagination';
import { ShopParams } from '../../shared/models/shopParams';

@Component({
  selector: 'app-shop',
  imports: [BookItemComponent],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss'
})
export class ShopComponent implements OnInit {

  private shopService = inject(ShopService);

  books?: Pagination<CatalogBook>;

  shopParams = new ShopParams();

  ngOnInit(): void {
    this.getBooks();
  }

  getBooks() {
    this.shopService.getBooks(this.shopParams).subscribe({
      next: response => this.books = response,
      error: error => console.log(error)
    });
  }
}
