import { CommonModule } from '@angular/common';
import { Component, HostListener, Input, Self } from '@angular/core';
import { FilteringItems } from '../../models/filteringItems';
import { ControlValueAccessor, FormControl, NgControl, ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-multi-select',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './multi-select.component.html',
  styleUrls: ['./multi-select.component.scss']
})
export class MultiSelectComponent implements ControlValueAccessor {
  @Input() options: FilteringItems[] = [];
  @Input() placeholder: string = 'Select options...';

  selectedOptions: FilteringItems[] = [];
  dropdownOpen = false;

  private onChange: any = () => {};
  private onTouched: any = () => {};

  // статический Subject для всех экземпляров
  private static openSubject = new Subject<MultiSelectComponent>();

  constructor(@Self() public controlDir: NgControl) {
    this.controlDir.valueAccessor = this;

    // подписка на другие экземпляры
    MultiSelectComponent.openSubject.subscribe(c => {
      if (c !== this) {
        this.dropdownOpen = false;
      }
    });
  }

  writeValue(obj: any): void {
    if (Array.isArray(obj)) {
      this.selectedOptions = this.options.filter(o => obj.includes(o.id));
    } else {
      this.selectedOptions = [];
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  get control(): FormControl {
    return this.controlDir.control as FormControl;
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
    this.onTouched();

    if (this.dropdownOpen) {
      MultiSelectComponent.openSubject.next(this); // уведомляем другие экземпляры
    }
  }

  selectOption(option: FilteringItems): void {
    const exists = this.selectedOptions.find(o => o.id === option.id);
    if (!exists) {
      this.selectedOptions.push(option);
    } else {
      this.selectedOptions = this.selectedOptions.filter(o => o.id !== option.id);
    }

    this.onChange(this.selectedOptions.map(o => o.id));
    this.onTouched();
  }

  removeOption(option: FilteringItems): void {
    this.selectedOptions = this.selectedOptions.filter(o => o.id !== option.id);
    this.onChange(this.selectedOptions.map(o => o.id));
    this.onTouched();
  }

  isSelected(option: FilteringItems): boolean {
    return this.selectedOptions.some(o => o.id === option.id);
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.multi-select-container')) {
      this.dropdownOpen = false;
    }
  }
}
