import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './navbar/navbar';
import { Layout } from './services/layout';

@Component({
  selector: 'berkeliumlabs-root',
  imports: [RouterOutlet, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  protected readonly isMobile = signal(false);

  private _layoutService = inject(Layout);

  ngOnInit() {
    this.isMobile.set(this._layoutService.isMobile);
  }
}
