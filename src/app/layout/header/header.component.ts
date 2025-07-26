import { Component, HostListener, inject } from '@angular/core';
import { MatBadge } from '@angular/material/badge';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { BusyService } from '../../core/services/busy.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CartService } from '../../core/services/cart.service';
import { CommonModule } from '@angular/common';
import { AccountService } from '../../core/services/account.service';

@Component({
  selector: 'app-header',
  imports: [MatBadge, RouterLink, RouterLinkActive, MatProgressBarModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  busyService = inject(BusyService);
  cartService = inject(CartService);
  accountService = inject(AccountService);
  private router = inject(Router);

  logout() {
    this.accountService.logout().subscribe({
      next: () => {
        this.accountService.currentUser.set(null);
        this.isMenuOpen = false; 
        this.router.navigateByUrl('/');
      }
    })
  }

  ngOnInit(): void {
    this.closeMenuOnResize();
  }

  isMenuOpen = false;

  toggleMenu() {
    if(this.accountService.currentUser()) {
      this.isMenuOpen = !this.isMenuOpen;
    } else {
      this.router.navigateByUrl('/account/login');
    }
  }

  @HostListener('document:click', ['$event'])
  closeMenu(event: MouseEvent) {
    const dropdown = document.getElementById('userDropdown');
    const button = document.getElementById('userButton');

    if (
      dropdown &&
      button &&
      !dropdown.contains(event.target as Node) &&
      !button.contains(event.target as Node)
    ) {
      this.isMenuOpen = false;
    }
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
