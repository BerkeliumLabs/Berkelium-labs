import { Injectable, Signal, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StateManagerService {
  selectedModel = signal<BkHuggingfaceModelData>({});
  isDownloading = signal<boolean>(false);
  progressBars = signal<string[]>([]);
  progressData = signal<any>({});
}
