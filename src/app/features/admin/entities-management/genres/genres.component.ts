import { Component, inject } from '@angular/core';
import { SnackbarService } from '../../../../core/services/snackbar.service';
import { BusyService } from '../../../../core/services/busy.service';
import { Genre } from '../../../../shared/models/genre';
import { Pagination } from '../../../../shared/models/pagination/pagination';
import { PaginationParams } from '../../../../shared/models/pagination/paginationParams';
import { AdminGenreService } from '../../../../core/services/admin-services/admin-genre.service';
import { LoadingAdminComponent } from "../../../../shared/components/loading-admin/loading-admin.component";
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { DatePipe } from '@angular/common';
import { DropdownIcon, DropdownOption } from '../../../../shared/models/dropdown/dropDownOptions';
import { DropdownComponent } from "../../../../shared/components/dropdown/dropdown.component";
import { AddGenreComponent } from "./add-genre/add-genre.component";
import { UpdateGenreComponent } from "./update-genre/update-genre.component";

@Component({
  selector: 'app-genres',
  imports: [LoadingAdminComponent, MatPaginator, DatePipe, DropdownComponent, AddGenreComponent, UpdateGenreComponent],
  templateUrl: './genres.component.html',
  styleUrl: './genres.component.scss'
})
export class GenresComponent {
  private snackbar = inject(SnackbarService);
  private adminGenreService = inject(AdminGenreService);
  busyService = inject(BusyService);

  paginationParams = new PaginationParams();
  genres?: Pagination<Genre>;

  createGenreModalOpen = false;
  editGenreModalOpen = false;
  genreToEdit?: Genre;

  ngOnInit(): void {
    this.getGenresList();
  }

  openCreateGenreModal() {
    this.createGenreModalOpen = true;
  }

  closeCreateGenreModal() {
    this.createGenreModalOpen = false;
  }

  onCreateGenreSaved(genre: { name: string }) {
    this.adminGenreService.addGenre(genre.name).subscribe({
      next: () => {
        this.getGenresList();
        this.snackbar.success('Genre created successfully!');
      },
      error: (error) => {
        const errorMessage = error?.error?.message || error?.message || 'Failed to create the genre';
        this.snackbar.error(errorMessage);
      }
    });
  }

  openEditGenreModal(genre: Genre) {
    this.editGenreModalOpen = true;
    this.genreToEdit = genre;
  }

  closeEditGenreModal() {
    this.editGenreModalOpen = false;
    this.genreToEdit = undefined;
  }

  onEditGenreSaved(genre: { name: string, genreId: number }) {
    this.adminGenreService.updateGenre(genre.genreId, genre.name).subscribe({
      next: () => {
        this.getGenresList();
        this.snackbar.success('Genre updated successfully!');
      },
      error: (error) => {
        const errorMessage = error?.error?.message || error?.message || 'Failed to update the genre';
        this.snackbar.error(errorMessage);
      }
    });
  }

  handlePageEvent(event: PageEvent) {
    this.paginationParams.PageNumber = event.pageIndex + 1;
    this.paginationParams.PageSize = event.pageSize;
    this.getGenresList();
  }

  getGenresList() {
    this.adminGenreService.getGenreList(this.paginationParams).subscribe({
      next: response => this.genres = response,
      error: error => console.error('Error fetching genres:', error)
    });
  }

  getDropDownOptions(genre: Genre): DropdownOption[] {
    const options: DropdownOption[] = [];

    options.push({
      label: 'Edit',
      action: () => this.openEditGenreModal(genre),
      class: 'text-gray-600',
      iconHover: 'group-hover:text-gray-800',
      icon: DropdownIcon.Edit
    });
    options.push({
      label: 'Delete',
      action: () => this.removeGenre(genre),
      class: 'text-red-600',
      iconHover: 'group-hover:text-red-800',
      icon: DropdownIcon.Trash
    });

    return options;
  }

  removeGenre(genre: Genre) {
    this.adminGenreService.deleteGenre(genre.id).subscribe({
      next: () => {
        this.getGenresList();
        this.snackbar.success('Genre deleted successfully!');
      },
      error: (error) => {
        const errorMessage = error?.error?.message || error?.message || 'Failed to delete the genre';
        this.snackbar.error(errorMessage);
      }
    });
  }

}
