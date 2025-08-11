import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-filter',
  standalone: true,
  template: `
  <div class="border border-gray-300 rounded-lg mb-4 text-sm">
    <div class="flex justify-between items-center px-4 py-3 cursor-pointer" (click)="toggleExpand()">
      <div class="font-medium text-gray-900">{{ filterName }}</div>
      <div class="flex items-center space-x-3">
        @if (selectedIds.length > 0) {
          <span class="text-xs text-gray-500">{{ selectedIds.length }} Selected</span>
        }
        @if (!expanded) {
          <svg class="w-4 h-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z"/>
          </svg>
        }
        @if (expanded) {
          <svg class="w-4 h-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4 10a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H4.75A.75.75 0 0 1 4 10Z" clip-rule="evenodd"/>
          </svg>
        }
      </div>
    </div>

    @if (expanded) {
      <div class="px-4 pb-4">
        <div *ngFor="let option of filterOptions" class="flex items-center gap-2 py-1">
          <input type="checkbox" class="accent-blue-600 w-4 h-4 cursor-pointer"
            [checked]="selectedIds.includes(option.id)" [id]="filterName + '-' + option.id"
            (change)="onSelectionChange(option)"/>
          <label [for]="filterName + '-' + option.id" class="cursor-pointer text-gray-700">
            {{ option.name }}
          </label>
        </div>
      </div>
    }
  </div>
  `,
  imports: [CommonModule],
})
export class FilterComponent {
  @Input() filterName: string = '';
  @Input() filterOptions: any[] = [];
  @Input() selectedIds: number[] = [];

  @Output() selectionChange = new EventEmitter<number[]>();

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
