import { Injectable, signal } from '@angular/core';

@Injectable()
export class LayoutService {
  themeMode = signal<'light' | 'dark'>('light');

  getSystemTheme() {
    let theme: 'light' | 'dark' = 'light';

    if (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      theme = 'dark';
    }

    this.themeMode.set(theme);

    return theme;
  }

  setSystemTheme() {
    this.themeMode.set(this.getSystemTheme());

    this.setThemeClass(this.themeMode());
  }

  toggleTheme() {
    this.themeMode.set(this.themeMode() === 'light' ? 'dark' : 'light');

    this.setThemeClass(this.themeMode());
  }

  private setThemeClass(theme: 'light' | 'dark') {
    if (theme === 'dark') {
      document.body.classList.remove('light');
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
      document.body.classList.add('light');
    }
  }
}
