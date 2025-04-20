import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { LayoutService } from './layout/layout.service';
import { IndexedDBService } from './services/indexed-db.service';
import { SpinnerComponent } from './components/spinner/spinner.component';

@Component({
  selector: 'berkeliumlabs-root',
  imports: [RouterOutlet, NavbarComponent, SpinnerComponent],
  template: `@if (!isMobile) { @defer (when isInitialized; prefetch on viewport)
    {
    <berkeliumlabs-navbar />
    <main class="flex-grow overflow-hidden">
      <router-outlet />
    </main>
    } @placeholder {
    <div class="h-screen flex items-center justify-center">
      <h2 class="text-primary-500">
        Berkelium Labs
      </h2>
    </div>
    } @loading {
    <div class="h-screen flex items-center justify-center">
      <berkeliumlabs-spinner class="mt-4"></berkeliumlabs-spinner>
    </div>
    } } @else {
    <div class="h-screen flex items-center justify-center p-4">
      <h2 class="!text-red-700 dark:!text-red-500 text-center">
        😢<br />Mobile devices are currently unsupported.
      </h2>
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
