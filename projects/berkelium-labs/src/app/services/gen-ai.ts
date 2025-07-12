import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GenAi {
  private modelUrl = 'models/gemma2-2b-it-gpu-int8.bin';
  private cacheName = 'gemma-model-cache';
  private downloadProgressSubject = new BehaviorSubject<number>(0);
  public downloadProgress$ = this.downloadProgressSubject.asObservable();

  private isModelLoadedSubject = new BehaviorSubject<boolean>(false);
  public isModelLoaded$ = this.isModelLoadedSubject.asObservable();
  /**
   * Downloads the ML model with progress tracking and caches it.
   */
  async downloadAndCacheModel(): Promise<void> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', this.modelUrl, true);
      xhr.responseType = 'arraybuffer'; // Important for binary files

      xhr.onprogress = (event: ProgressEvent) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          this.downloadProgressSubject.next(progress);
          console.log(`Download progress: ${progress}%`);
        }
      };

      xhr.onload = async () => {
        if (xhr.status === 200) {
          localStorage.setItem(this.cacheName, 'true');
          this.downloadProgressSubject.next(100);
          this.isModelLoadedSubject.next(true);
          resolve();
        } else {
          console.error(`Failed to download ML model. Status: ${xhr.status}`);
          this.isModelLoadedSubject.next(false);
          reject(
            new Error(`Failed to download ML model. Status: ${xhr.status}`)
          );
        }
      };

      xhr.onerror = (error) => {
        console.error('Network error during ML model download:', error);
        this.isModelLoadedSubject.next(false);
        reject(error);
      };

      xhr.send();
    });
  }

  /**
   * Checks if the model is already in the cache.
   * @returns A promise that resolves to true if the model is cached, false otherwise.
   */
  async isModelCached(): Promise<boolean> {
    if (localStorage.getItem(this.cacheName) === 'true') {
      return true;
    }
    return false;
  }
}
