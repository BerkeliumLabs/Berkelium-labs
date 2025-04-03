import { Component, inject } from '@angular/core';
import { LayoutService } from '../layout.service';
import { Router } from '@angular/router';

@Component({
  selector: 'berkeliumlabs-navbar',
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  private _layoutService = inject(LayoutService);
  private router = inject(Router);

  themeMode: 'light' | 'dark' = 'light';
  isCollapsed = false;

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  toggleTheme(): void {
    this._layoutService.toggleTheme();
    this.themeMode = this._layoutService.themeMode();
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }
}
