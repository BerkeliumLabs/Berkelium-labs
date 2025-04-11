import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { LayoutService } from './layout/layout.service';
import { IndexedDBService } from './services/indexed-db.service';

@Component({
  selector: 'berkeliumlabs-root',
  imports: [RouterOutlet, NavbarComponent],
  template: ` <berkeliumlabs-navbar />
    <main class="flex-grow">
      <router-outlet />
    </main>`,
  styles: [],
  providers: [LayoutService],
})
export class AppComponent implements OnInit {
  private _layoutService = inject(LayoutService);
  private dbService = inject(IndexedDBService);

  ngOnInit(): void {
    this._layoutService.setSystemTheme();
    this.dbService.initializeDB([
      { name: 'models'},
      { name: 'modelData'},
      { name: 'modelFiles'},
      { name: 'chats'},
    ]);
  }
}
