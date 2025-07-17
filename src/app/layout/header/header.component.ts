import { Component, HostListener } from '@angular/core';
import { MatBadge } from '@angular/material/badge';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [MatBadge, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
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
