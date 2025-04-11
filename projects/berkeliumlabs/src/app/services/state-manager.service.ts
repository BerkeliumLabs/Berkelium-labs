import { Injectable, signal } from '@angular/core';
import { BkChat } from '../chat/chat.component';

@Injectable({
  providedIn: 'root'
})
export class StateManagerService {
  selectedModel = signal<BkHuggingfaceModelData>({});
  isDownloading = signal<boolean>(false);
  progressBars = signal<string[]>([]);
  progressData = signal<any>({});
  downloadingModelId = signal<string>('');
  chats = signal<BkChat[]>([])
}
