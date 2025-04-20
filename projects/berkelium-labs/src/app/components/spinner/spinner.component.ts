import { Component, Input } from '@angular/core';

@Component({
  selector: 'berkeliumlabs-spinner',
  imports: [],
  template: `@if(type === 'ping') {
    <div class="flex justify-center">
      <div
        class="w-16 h-16 bg-primary-500
                        rounded-full animate-ping"
      ></div>
    </div>
  } @else {
    <div class="flex justify-center">
      <div
        class="w-16 h-16 border-4 border-primary-500
                        border-t-transparent rounded-full 
                        animate-spin"
      ></div>
    </div>
  }
  `,
  styles: [],
})
export class SpinnerComponent {
  @Input() type: 'spin' | 'ping' = 'spin'; 
}
