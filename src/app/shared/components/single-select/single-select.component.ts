import { CommonModule } from '@angular/common';
import { Component, HostListener, Input, Self } from '@angular/core';
import { FilteringItems } from '../../models/filteringItems';
import { ControlValueAccessor, FormControl, NgControl, ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-single-select',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './single-select.component.html',
  styleUrls: ['./single-select.component.scss']
})
export class SingleSelectComponent implements ControlValueAccessor {
  @Input() options: FilteringItems[] = [];
  @Input() placeholder: string = 'Select an option';

  selectedOption: FilteringItems | null = null;
  dropdownOpen = false;

  private onChange: any = () => {};
  private onTouched: any = () => {};

  // Статический Subject для автозакрытия
  private static openSubject = new Subject<SingleSelectComponent>();

  constructor(@Self() public controlDir: NgControl) {
    this.controlDir.valueAccessor = this;

    SingleSelectComponent.openSubject.subscribe(c => {
      if (c !== this) this.dropdownOpen = false;
    });
  }

  writeValue(obj: any): void {
    if (obj != null) {
      this.selectedOption = this.options.find(o => o.id === obj) || null;
    } else {
      this.selectedOption = null;
    }
  }

  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }

  get control(): FormControl {
    return this.controlDir.control as FormControl;
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
    this.onTouched();
    if (this.dropdownOpen) {
      SingleSelectComponent.openSubject.next(this);
    }
  }

  selectOption(option: FilteringItems): void {
    this.selectedOption = option;
    this.dropdownOpen = false;
    this.onChange(option.id);
    this.onTouched();
  }

  isSelected(option: FilteringItems): boolean {
    return this.selectedOption?.id === option.id;
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.single-select-container')) {
      this.dropdownOpen = false;
    }
  }
}
