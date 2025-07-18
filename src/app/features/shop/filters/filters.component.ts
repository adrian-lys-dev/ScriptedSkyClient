import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-filter',
  standalone: true,
  template: `
    <div class="border rounded p-2">
      <div class="flex justify-between items-center cursor-pointer" (click)="toggleExpand()">
        <label class="flex items-center space-x-2">
          <span>{{ filterName }}</span>
        </label>
        <!-- + / - -->
        <svg *ngIf="!expanded" class="size-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
          <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z"></path>
        </svg>
        <svg *ngIf="expanded" class="size-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
          <path fill-rule="evenodd" d="M4 10a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H4.75A.75.75 0 0 1 4 10Z" clip-rule="evenodd"></path>
        </svg>
      </div>
      <div *ngIf="expanded" class="mt-2 pl-4">
        <div *ngFor="let option of filterOptions" class="flex items-center space-x-2 cursor-pointer" (click)="onSelectionChange(option)">
          <input 
            type="checkbox" 
            [checked]="selectedIds.includes(option.id)"
            [id]="filterName + '-' + option.id">
          <span>{{ option.name }}</span>
        </div>
      </div>
    </div>
  `,
  imports: [CommonModule],
})
export class FilterComponent {
  @Input() filterName: string = '';
  @Input() filterOptions: any[] = [];
  @Input() selectedIds: string[] = [];

  @Output() selectionChange = new EventEmitter<string[]>(); 

  expanded: boolean = false;

  onSelectionChange(option: any) {
    const isSelected = this.selectedIds.includes(option.id);
    if (isSelected) {
      this.selectedIds = this.selectedIds.filter(id => id !== option.id);
    } else {
      this.selectedIds = [...this.selectedIds, option.id];
    }
    this.selectionChange.emit(this.selectedIds);
  }

  toggleExpand() {
    this.expanded = !this.expanded;
  }
}