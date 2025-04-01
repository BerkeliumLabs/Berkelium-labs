import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'berkeliumlabs-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'Berkeliumlabs Studio';

  test() {
    window.berkelium
      .readAppSettings()
      .then((settings: BkAppSettings | null) => {
        if (settings) {
          console.log('Settings:', settings);
        } else {
          const settings: BkAppSettings = {
            version: '1',
            cacheDir: 'D:',
          }

          window.berkelium.writeAppSettings(settings);
        }
      });
  }
}
