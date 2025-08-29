import { Component, HostListener, inject } from '@angular/core';
import { MatBadge } from '@angular/material/badge';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { BusyService } from '../../core/services/busy.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CartService } from '../../core/services/cart.service';
import { CommonModule } from '@angular/common';
import { AccountService } from '../../core/services/account.service';
import { IsAdmin } from '../../shared/directives/is-admin';

@Component({
  selector: 'app-header',
  imports: [MatBadge, RouterLink, RouterLinkActive, MatProgressBarModule, CommonModule, IsAdmin],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  busyService = inject(BusyService);
  cartService = inject(CartService);
  accountService = inject(AccountService);
  private router = inject(Router);

  isMenuOpen = false;

  ngOnInit(): void {
    this.closeMenuOnResize();

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isMenuOpen = false;
      }
    });
  }
  
  toggleMenu() {
    if(this.accountService.currentUser()) {
      this.isMenuOpen = !this.isMenuOpen;
    } else {
      this.router.navigateByUrl('/account/login');
    }
  }

  logout() {
    this.accountService.logout().subscribe({
      next: () => {
        this.accountService.currentUser.set(null);
        this.isMenuOpen = false;
        this.router.navigateByUrl('/');
      }
    })
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
