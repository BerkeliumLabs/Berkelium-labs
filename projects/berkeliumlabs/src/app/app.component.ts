import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./layout/navbar/navbar.component";

@Component({
  selector: 'berkeliumlabs-root',
  imports: [RouterOutlet, NavbarComponent],
  template: `
  <berkeliumlabs-navbar />
  <main class="flex-grow">
    <router-outlet />
  </main>`,
  styles: [],
})
export class AppComponent {}
