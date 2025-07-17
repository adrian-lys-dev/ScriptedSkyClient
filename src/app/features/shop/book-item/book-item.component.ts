import { Component, Input } from '@angular/core';
import { CatalogBook } from '../../../shared/models/catalogBook';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-book-item',
  imports: [MatIcon, RouterLink],
  templateUrl: './book-item.component.html',
  styleUrl: './book-item.component.scss'
})
export class BookItemComponent {
  @Input() book?: CatalogBook;
}
