import { Component, HostListener, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ShopService } from '../../core/services/shop.service';
import { CatalogBook } from '../../shared/models/catalogBook';
import { BookItemComponent } from './book-item/book-item.component';
import { Pagination } from '../../shared/models/pagination';
import { ShopParams } from '../../shared/models/shopParams';
import { FilteringItems } from '../../shared/models/filteringItems';
import { FormsModule } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { FilterComponent } from './filters/filters.component';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [BookItemComponent, FormsModule, CommonModule, FilterComponent, MatPaginator],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss'
})
export class ShopComponent implements OnInit {

  private shopService = inject(ShopService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

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

  isOpen = false;
  isFiltersVisible = false;

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.shopParams.PageNumber = +params['page'] || 1;
      this.shopParams.PageSize = +params['pageSize'] || 10;
      this.shopParams.sort = params['sort'] || '';

      this.selectedIdGenres = params['genres'] ? params['genres'].split(',') : [];
      this.selectedIdAuthors = params['authors'] ? params['authors'].split(',') : [];
      this.selectedIdPublishers = params['publishers'] ? params['publishers'].split(',') : [];

      this.shopParams.genres = this.selectedIdGenres;
      this.shopParams.authors = this.selectedIdAuthors;
      this.shopParams.publishers = this.selectedIdPublishers;

      this.getBooks();
    });

    this.getGenreForFilter();
    this.getAuthorForFilter();
    this.getPublisherForFilter();
  }

  updateUrl() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        page: this.shopParams.PageNumber,
        pageSize: this.shopParams.PageSize,
        sort: this.shopParams.sort || null,
        genres: this.selectedIdGenres.length ? this.selectedIdGenres.join(',') : null,
        authors: this.selectedIdAuthors.length ? this.selectedIdAuthors.join(',') : null,
        publishers: this.selectedIdPublishers.length ? this.selectedIdPublishers.join(',') : null
      },
      queryParamsHandling: 'merge'
    });
  }

  onSearchChange() {
    this.shopParams.PageNumber = 1;
    this.updateUrl();
    this.getBooks();
  }

  handlePageEvent(event: PageEvent) {
    this.shopParams.PageNumber = event.pageIndex + 1;
    this.shopParams.PageSize = event.pageSize;
    this.updateUrl();
    this.getBooks();
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  @HostListener('document:click', ['$event'])
  closeDropdown(event: MouseEvent) {
    const dropdown = document.getElementById('dropdown');
    const button = document.getElementById('sortButton');
    if (dropdown && button && !dropdown.contains(event.target as Node) && !button.contains(event.target as Node)) {
      this.isOpen = false;
    }
  }

  onSortChange(sortValue: string) {
    if (sortValue) {
      this.shopParams.sort = sortValue;
      this.shopParams.PageNumber = 1;
      this.updateUrl();
      this.getBooks();
    }
  }

  toggleFilters() {
    this.isFiltersVisible = !this.isFiltersVisible;
  }

  applyFilters() {
    this.shopParams.genres = this.selectedIdGenres;
    this.shopParams.authors = this.selectedIdAuthors;
    this.shopParams.publishers = this.selectedIdPublishers;
    this.shopParams.PageNumber = 1;
    this.updateUrl();
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
    this.updateUrl();
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
