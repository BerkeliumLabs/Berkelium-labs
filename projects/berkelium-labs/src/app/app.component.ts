import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { LayoutService } from './layout/layout.service';
import { IndexedDBService } from './services/indexed-db.service';

@Component({
  selector: 'berkeliumlabs-root',
  imports: [RouterOutlet, NavbarComponent],
  template: `@if (!isMobile) { @defer (when isInitialized; prefetch on viewport)
    {
    <berkeliumlabs-navbar />
    <main class="flex-grow">
      <router-outlet />
    </main>
    } @placeholder {
    <div class="h-screen flex items-center justify-center">
      <div
        class="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"
      ></div>
    </div>
    } @loading {
    <p>Loading comments...</p>
    } } @else {
    <div class="h-screen flex items-center justify-center p-4">
      <h2 class="!text-red-700 dark:!text-red-500 text-center">Mobile devices are currently unsupported.</h2>
    </div>
    }`,
  styles: [],
  providers: [LayoutService],
})
export class AppComponent implements OnInit {
  private _layoutService = inject(LayoutService);
  private dbService = inject(IndexedDBService);

  isInitialized = false;
  isMobile = false;

  ngOnInit(): void {
    this.isMobile = this._layoutService.isMobile;
    this._layoutService.setSystemTheme();
    this.dbService
      .initializeDB([
        { name: 'models' },
        { name: 'modelData' },
        { name: 'modelFiles' },
        { name: 'chats' },
      ])
      .subscribe((isInitialized) => (this.isInitialized = isInitialized));
  }
}
