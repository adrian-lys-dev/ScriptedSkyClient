import { Component, inject } from '@angular/core';
import { SnackbarService } from '../../../../core/services/snackbar.service';
import { BusyService } from '../../../../core/services/busy.service';
import { AdminPublisherService } from '../../../../core/services/admin-services/admin-publisher.service';
import { PaginationParams } from '../../../../shared/models/pagination/paginationParams';
import { Publisher } from '../../../../shared/models/publisher';
import { Pagination } from '../../../../shared/models/pagination/pagination';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { DropdownIcon, DropdownOption } from '../../../../shared/models/dropdown/dropDownOptions';
import { LoadingAdminComponent } from "../../../../shared/components/loading-admin/loading-admin.component";
import { DropdownComponent } from "../../../../shared/components/dropdown/dropdown.component";
import { DatePipe } from '@angular/common';
import { UpdatePublisherComponent } from "./update-publisher/update-publisher.component";
import { AddPublisherComponent } from "./add-publisher/add-publisher.component";

@Component({
  selector: 'app-publishers',
  imports: [LoadingAdminComponent, DropdownComponent, MatPaginator, DatePipe, UpdatePublisherComponent, AddPublisherComponent],
  templateUrl: './publishers.component.html',
  styleUrl: './publishers.component.scss'
})
export class PublishersComponent {
  private snackbar = inject(SnackbarService);
  private adminPublisher = inject(AdminPublisherService);
  busyService = inject(BusyService);

  paginationParams = new PaginationParams();
  publishers?: Pagination<Publisher>;

  createPublisherModalOpen = false;
  editPublisherModalOpen = false;
  publisherToEdit?: Publisher;

  ngOnInit(): void {
    this.getPublishersList();
  }

  getPublishersList() {
    this.adminPublisher.getPublisherList(this.paginationParams).subscribe({
      next: response => this.publishers = response,
      error: error => console.error('Error fetching publishers:', error)
    });
  }

  handlePageEvent(event: PageEvent) {
    this.paginationParams.PageNumber = event.pageIndex + 1;
    this.paginationParams.PageSize = event.pageSize;
    this.getPublishersList();
  }

  getDropDownOptions(publisher: Publisher): DropdownOption[] {
    const options: DropdownOption[] = [];

    options.push({
      label: 'Edit',
      action: () => this.openEditPublisherModal(publisher),
      class: 'text-gray-600',
      iconHover: 'group-hover:text-gray-800',
      icon: DropdownIcon.Edit
    });
    options.push({
      label: 'Delete',
      action: () => this.removePublisher(publisher),
      class: 'text-red-600',
      iconHover: 'group-hover:text-red-800',
      icon: DropdownIcon.Trash
    });

    return options;
  }

  openCreatePublisherModal() {
    this.createPublisherModalOpen = true;
  }

  closeCreatePublisherModal() {
    this.createPublisherModalOpen = false;
  }

  onCreatePublisherSaved(publisher: { name: string }) {
    this.adminPublisher.addPublisher(publisher.name).subscribe({
      next: () => {
        this.getPublishersList();
        this.snackbar.success('Publisher created successfully!');
      },
      error: (error) => {
        const errorMessage = error?.error?.message || error?.message || 'Failed to create the publisher';
        this.snackbar.error(errorMessage);
      }
    });
  }

  openEditPublisherModal(publisher: Publisher) {
    this.editPublisherModalOpen = true;
    this.publisherToEdit = publisher;
  }

  closeEditPublisherModal() {
    this.editPublisherModalOpen = false;
    this.publisherToEdit = undefined;
  }

  onEditPublisherSaved(publisher: { name: string, publisherId: number }) {
    this.adminPublisher.updatePublisher(publisher.publisherId, publisher.name).subscribe({
      next: () => {
        this.getPublishersList();
        this.snackbar.success('Publisher updated successfully!');
      },
      error: (error) => {
        const errorMessage = error?.error?.message || error?.message || 'Failed to update the publisher';
        this.snackbar.error(errorMessage);
      }
    });
  }

  removePublisher(publisher: Publisher) {
    this.adminPublisher.deletePublisher(publisher.id).subscribe({
      next: () => {
        this.getPublishersList();
        this.snackbar.success('Publisher deleted successfully!');
      },
      error: (error) => {
        const errorMessage = error?.error?.message || error?.message || 'Failed to delete the publisher';
        this.snackbar.error(errorMessage);
      }
    });
  }

}
