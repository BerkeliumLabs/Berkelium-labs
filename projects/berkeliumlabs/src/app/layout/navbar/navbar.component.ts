import { Component, inject } from '@angular/core';
import { LayoutService } from '../layout.service';
import { Router } from '@angular/router';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

@Component({
  selector: 'berkeliumlabs-navbar',
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  animations: [
    trigger('toggle', [
      state('true', style({ opacity: 1, width: 'auto' })),
      state('false', style({ opacity: 0, width: 0 })),
      transition('false <=> true', animate('1000ms ease-in-out'))
    ]),
  ],
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
