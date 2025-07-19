import { Component, Input } from '@angular/core';
import { CatalogBook } from '../../../shared/models/catalogBook';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-book-item',
  imports: [RouterLink],
  templateUrl: './book-item.component.html',
  styleUrl: './book-item.component.scss'
})
export class BookItemComponent {
  @Input() book?: CatalogBook;
}
