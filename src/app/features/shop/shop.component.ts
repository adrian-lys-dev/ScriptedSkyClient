import { Component, HostListener, inject, OnInit } from '@angular/core';
import { ShopService } from '../../core/services/shop.service';
import { CatalogBook } from '../../shared/models/catalogBook';
import { BookItemComponent } from './book-item/book-item.component';
import { Pagination } from '../../shared/models/pagination';
import { ShopParams } from '../../shared/models/shopParams';
import { FilteringItems } from '../../shared/models/filteringItems';
import { FormsModule } from '@angular/forms';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { FilterComponent } from './filters/filters.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BusyService } from '../../core/services/busy.service';

@Component({
  selector: 'app-shop',
  imports: [BookItemComponent, FormsModule, CommonModule, FilterComponent, MatPaginator, MatProgressSpinnerModule],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss'
})
export class ShopComponent implements OnInit {

  private shopService = inject(ShopService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  busyService = inject(BusyService);

  books?: Pagination<CatalogBook>;

  genres: FilteringItems[] = [];
  authors: FilteringItems[] = [];
  publishers: FilteringItems[] = [];
  languages: FilteringItems[] = [];

  selectedIdGenres: number[] = [];
  selectedIdAuthors: number[] = [];
  selectedIdPublishers: number[] = [];
  selectedIdLanguages: number[] = [];

  shopParams = new ShopParams();

  sortOptions = [
    { name: 'Alphabetical', value: 'name' },
    { name: 'Price: Low-High', value: 'priceAsc' },
    { name: 'Price: High-Low', value: 'priceDesc' }
  ];

  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {
      const hasParams = Object.keys(params).length > 0;

      this.shopParams.PageNumber = +params['page'] || 1;
      this.shopParams.PageSize = +params['pageSize'] || 8;
      this.shopParams.sort = params['sort'] || '';
      this.shopParams.search = params['search'] || '';

      this.selectedIdGenres = params['genres'] ? params['genres'].split(',').map((id: string) => +id):[];
      this.selectedIdAuthors = params['authors'] ? params['authors'].split(',').map((id: string) => +id):[];
      this.selectedIdPublishers = params['publishers'] ? params['publishers'].split(',').map((id: string) => +id):[];

      this.shopParams.genres = this.selectedIdGenres.map(id => id.toString());
      this.shopParams.authors = this.selectedIdAuthors.map(id => id.toString());
      this.shopParams.publishers = this.selectedIdPublishers.map(id => id.toString());


      if (!hasParams) {
        this.updateUrlParams();
      } else {
        this.getBooks();        
      }
    });

    this.getFilteringItems();
  }

  private updateUrlParams() {
    const queryParams = {
      page: this.shopParams.PageNumber,
      pageSize: this.shopParams.PageSize,
      sort: this.shopParams.sort || null,
      search: this.shopParams.search || null,

      genres: this.shopParams.genres.length > 0 ? this.shopParams.genres.join(',') : null,
      authors: this.shopParams.authors.length > 0 ? this.shopParams.authors.join(',') : null,
      publishers: this.shopParams.publishers.length > 0 ? this.shopParams.publishers.join(',') : null
    };

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      queryParamsHandling: 'merge',
    });
  }


  getFilteringItems() {
    this.getGenreForFilter();
    this.getAuthorForFilter();
    this.getPublisherForFilter();
  }

  onSearchChange() {
    this.shopParams.PageNumber = 1;
    this.updateUrlParams();
  }

  handlePageEvent(event: PageEvent) {
    this.shopParams.PageNumber = event.pageIndex + 1;
    this.shopParams.PageSize = event.pageSize;
    this.updateUrlParams();
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
      this.updateUrlParams();
    }
  }

  // Filtering
  isFiltersVisible = false;

  toggleFilters() {
    this.isFiltersVisible = !this.isFiltersVisible;
  }

  applyFilters() {
    this.shopParams.genres = this.selectedIdGenres.map(id => id.toString());
    this.shopParams.authors = this.selectedIdAuthors.map(id => id.toString());
    this.shopParams.publishers = this.selectedIdPublishers.map(id => id.toString());
    this.shopParams.PageNumber = 1;

    this.updateUrlParams();
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

    this.updateUrlParams();
  }

  onSelectionChange(selectedIds: number[], targetProperty: 'selectedIdGenres' | 'selectedIdAuthors' | 'selectedIdPublishers') {
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