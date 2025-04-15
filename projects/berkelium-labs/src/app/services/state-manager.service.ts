import { Injectable, signal } from '@angular/core';
import { BkChat } from '../chat/chat.component';
import { BkChatHistory } from '../layout/navbar/navbar.component';

@Injectable({
  providedIn: 'root'
})
export class StateManagerService {
  selectedModel = signal<BkHuggingfaceModelData>({});
  isDownloading = signal<boolean>(false);
  progressBars = signal<string[]>([]);
  progressData = signal<any>({});
  downloadingModelId = signal<string>('');
  chats = signal<BkChatHistory[]>([]);
  activeChatId = signal<string>('');

  addChat(chat: BkChatHistory): void {
    const updatedChats = [chat, ...this.chats()];
    this.chats.set(updatedChats);
  }

  removeChat(chatId: string): void {
    const updatedChats = this.chats().filter((chat) => chat.id !== chatId);
    this.chats.set(updatedChats);
  }
}
