import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './navbar/navbar';
import { Layout } from './services/layout';
import { GenAi } from './services/gen-ai';

@Component({
  selector: 'berkeliumlabs-root',
  imports: [RouterOutlet, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  protected readonly isMobile = signal(false);

  private _layoutService = inject(Layout);
  private _genAiService = inject(GenAi);

  ngOnInit() {
    this.isMobile.set(this._layoutService.isMobile);

    if (!this.isMobile()) {
      this._genAiService.isModelCached().then((isCached) => {
        if (isCached) {
          console.log('Model is already cached');
        } else {
          this._genAiService
            .downloadAndCacheModel()
            .then(() => {
              console.log('Model downloaded and cached successfully');
            })
            .catch((error) => {
              console.error('Error downloading model:', error);
            });

          this._genAiService.downloadProgress$.subscribe((progress) => {
            console.log(`Download progress: ${progress}%`);
          });

          this._genAiService.isModelLoaded$.subscribe((isLoaded) => {
            console.log(`Model loaded: ${isLoaded}`);
          });
        }
      });
    }
  }
}
