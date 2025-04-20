import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {
  formatBytes(bytes: number): string {
    if (typeof bytes !== 'number' || isNaN(bytes)) {
      return 'Invalid input';
    }

    if (bytes < 1024) {
      return `${bytes} B`; // Bytes
    } else if (bytes < 1024 * 1024) {
      const kb = (bytes / 1024).toFixed(2);
      return `${kb} KB`; // Kilobytes
    } else if (bytes < 1024 * 1024 * 1024) {
      const mb = (bytes / (1024 * 1024)).toFixed(2);
      return `${mb} MB`; // Megabytes
    } else {
      const gb = (bytes / (1024 * 1024 * 1024)).toFixed(2);
      return `${gb} GB`; // Gigabytes
    }
  }
}
