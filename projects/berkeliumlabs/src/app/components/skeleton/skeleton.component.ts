import { Component } from "@angular/core";

@Component({
    selector: 'berkeliumlabs-skeleton',
    imports: [],
    template: `<div class="space-y-4 mb-6">
      <div class="animate-pulse bg-gray-300 rounded-full h-8 w-24 mb-2"></div>
      <div class="animate-pulse bg-gray-300 rounded-md h-4 w-full mb-1"></div>
      <div class="animate-pulse bg-gray-300 rounded-md h-4 w-4/5 mb-1"></div>
      <div class="animate-pulse bg-gray-300 rounded-md h-4 w-1/2"></div>
  </div>`
})
export class SkeletonComponent {}
