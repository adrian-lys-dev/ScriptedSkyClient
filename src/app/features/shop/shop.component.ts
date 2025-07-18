import { Component, HostListener, inject, OnInit } from '@angular/core';
import { ShopService } from '../../core/services/shop.service';
import { CatalogBook } from '../../shared/models/catalogBook';
import { BookItemComponent } from './book-item/book-item.component';
import { Pagination } from '../../shared/models/pagination';
import { ShopParams } from '../../shared/models/shopParams';
import { FilteringItems } from '../../shared/models/filteringItems';
import { FormsModule } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { FilterComponent } from './filters/filters.component';

@Component({
  selector: 'app-shop',
  imports: [BookItemComponent, FormsModule, CommonModule, FilterComponent],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss'
})
export class ShopComponent implements OnInit {

  private shopService = inject(ShopService);

  books?: Pagination<CatalogBook>;

  genres: FilteringItems[] = [];
  authors: FilteringItems[] = [];
  publishers: FilteringItems[] = [];
  languages: FilteringItems[] = [];

  selectedIdGenres: string[] = [];
  selectedIdAuthors: string[] = [];
  selectedIdPublishers: string[] = [];
  selectedIdLanguages: string[] = [];

  shopParams = new ShopParams();

  sortOptions = [
    { name: 'Alphabetical', value: 'name' },
    { name: 'Price: Low-High', value: 'priceAsc' },
    { name: 'Price: High-Low', value: 'priceDesc' }
  ];

  ngOnInit(): void {
    this.getBooks();
    this.getGenreForFilter();
    this.getAuthorForFilter();
    this.getPublisherForFilter();
  }

  onSearchChange() {
    this.shopParams.PageNumber = 1;
    this.getBooks();
  }

  handlePageEvent(event: PageEvent) {
    this.shopParams.PageNumber = event.pageIndex + 1;
    this.shopParams.PageSize = event.pageSize;
    this.getBooks();
  }


  // Sorting
  isOpen = false;

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  @HostListener('document:click', ['$event'])
  closeDropdown(event: MouseEvent) {
    // Get references to the dropdown menu and the sort button elements by their IDs
    const dropdown = document.getElementById('dropdown');
    const button = document.getElementById('sortButton');

    // If both elements exist and the click event target is NOT inside the dropdown or the button,
    // then close the dropdown by setting isOpen to false
    if (dropdown && button && !dropdown.contains(event.target as Node) && !button.contains(event.target as Node)) {
      this.isOpen = false;
    }
  }


  onSortChange(sortValue: string) {
    if (sortValue) {
      this.shopParams.sort = sortValue;
      this.shopParams.PageNumber = 1;
      this.getBooks();
    }
  }

  // Filtering

  isFiltersVisible = false;

  toggleFilters() {
    this.isFiltersVisible = !this.isFiltersVisible;
  }

  applyFilters() {
    this.shopParams.genres = this.selectedIdGenres,
      this.shopParams.authors = this.selectedIdAuthors,
      this.shopParams.publishers = this.selectedIdPublishers,
      this.shopParams.PageNumber = 1;
    // console.log('Shop Params:', this.shopParams);
    this.getBooks();
  }

  resetFilters() {
    this.selectedIdGenres = [];
    this.selectedIdAuthors = [];
    this.selectedIdPublishers = [];
    this.selectedIdLanguages = [];

    this.shopParams.genres = [];
    this.shopParams.authors = [];
    this.shopParams.publishers = [];
    this.shopParams.PageNumber = 1;
    // console.log('Filters reset');
    // console.log('Shop Params after reset:', this.shopParams);
    this.getBooks();
  }

  onSelectionChange(selectedIds: string[], targetProperty: 'selectedIdGenres' | 'selectedIdAuthors' | 'selectedIdPublishers') {
    this[targetProperty] = selectedIds;
  }

  getBooks() {
    this.shopService.getBooks(this.shopParams).subscribe({
      next: response => this.books = response,
      error: error => console.log(error)
    });
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
