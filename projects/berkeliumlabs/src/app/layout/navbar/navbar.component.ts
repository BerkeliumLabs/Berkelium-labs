import { Component, inject } from '@angular/core';
import { LayoutService } from '../layout.service';

@Component({
  selector: 'berkeliumlabs-navbar',
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  private _layoutService = inject(LayoutService);

  themeMode: 'light' | 'dark' = 'light';
  isCollapsed = false;

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  toggleTheme() {
    this._layoutService.toggleTheme();
    this.themeMode = this._layoutService.themeMode();
  }
}
