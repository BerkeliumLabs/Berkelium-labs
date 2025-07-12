import { inject, Injectable } from '@angular/core';
import { Platform } from '@angular/cdk/platform';

@Injectable({
  providedIn: 'root'
})
export class Layout {
  private platform = inject(Platform)

  get isMobile() {
    return this.platform.ANDROID || this.platform.IOS;
  }
}
