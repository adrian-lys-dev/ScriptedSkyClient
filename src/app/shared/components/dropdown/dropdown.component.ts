import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { DropdownOption } from '../../models/dropdown/dropDownOptions';

@Component({
  selector: 'app-dropdown',
  imports: [],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.scss'
})
export class DropdownComponent {
  @Input() options: DropdownOption[] = [];
  @Input() label: string = 'Actions';

  @Output() optionSelected = new EventEmitter<DropdownOption>();

  isOpen: boolean = false;
  private static openedDropdown: DropdownComponent | null = null;
  

  toggleDropdown() {
    if (this.isOpen) {
      this.closeDropdown();
    } else {
      if (DropdownComponent.openedDropdown && DropdownComponent.openedDropdown !== this) {
        DropdownComponent.openedDropdown.closeDropdown();
      }
      this.isOpen = true;
      DropdownComponent.openedDropdown = this;
    }
  }

  closeDropdown() {
    this.isOpen = false;
    if (DropdownComponent.openedDropdown === this) {
      DropdownComponent.openedDropdown = null;
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const clickedInside = target.closest('.dropdown-container');
    if (!clickedInside || !clickedInside.contains(target)) {
      this.closeDropdown();
    }
  }

  selectOption(option: DropdownOption) {
    option.action();
    this.optionSelected.emit(option);
    this.closeDropdown();
  }

}
