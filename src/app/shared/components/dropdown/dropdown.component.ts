import { Component, EventEmitter, Input, Output, ElementRef, ViewChild } from '@angular/core';
import { DropdownOption } from '../../models/dropdown/dropDownOptions';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dropdown',
  imports: [CommonModule],
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent {
  @Input() options: DropdownOption[] = [];
  @Input() label: string = 'Actions';
  @Output() optionSelected = new EventEmitter<DropdownOption>();

  isOpen: boolean = false;
  private overlayRef!: OverlayRef;

  @ViewChild('dropdownMenu') dropdownMenuTemplate!: any;

  constructor(private overlay: Overlay, private vcr: ViewContainerRef, private el: ElementRef) {}

  toggleDropdown() {
    if (this.isOpen) {
      this.closeDropdown();
    } else {
      const positionStrategy = this.overlay.position()
        .flexibleConnectedTo(this.el.nativeElement.querySelector('button'))
        .withPositions([{
          originX: 'end',
          originY: 'bottom',
          overlayX: 'end',
          overlayY: 'top',
        }]);

      this.overlayRef = this.overlay.create({
        positionStrategy,
        scrollStrategy: this.overlay.scrollStrategies.reposition(),
        hasBackdrop: true,
        backdropClass: 'cdk-overlay-transparent-backdrop'
      });

      this.overlayRef.backdropClick().subscribe(() => this.closeDropdown());

      const portal = new TemplatePortal(this.dropdownMenuTemplate, this.vcr);
      this.overlayRef.attach(portal);

      this.isOpen = true;
    }
  }

  closeDropdown() {
    if (this.overlayRef) {
      this.overlayRef.detach();
      this.overlayRef.dispose();
    }
    this.isOpen = false;
  }

  selectOption(option: DropdownOption) {
    option.action();
    this.optionSelected.emit(option);
    this.closeDropdown();
  }
}
