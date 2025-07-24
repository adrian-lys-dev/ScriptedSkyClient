import { Component, HostListener, inject } from '@angular/core';
import { MatBadge } from '@angular/material/badge';
import { RouterLink,  RouterLinkActive} from '@angular/router';
import { BusyService } from '../../core/services/busy.service';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-header',
  imports: [MatBadge, RouterLink, RouterLinkActive, MatProgressBarModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  busyService = inject(BusyService);
  cartService = inject(CartService);

  ngOnInit(): void {
    this.closeMenuOnResize();    
  }

  @HostListener('window:resize', [])
  onResize() {
    this.closeMenuOnResize();
    
  }

  private closeMenuOnResize() {
    const menuToggle = document.getElementById('menu-toggle') as HTMLInputElement | null;
    if (window.innerWidth >= 768 && menuToggle?.checked) {
      menuToggle.checked = false;
    }
  }
}
