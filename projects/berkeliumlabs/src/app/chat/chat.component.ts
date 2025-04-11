import { Component, inject, OnInit } from '@angular/core';
import { ChatBubbleComponent } from './chat-bubble/chat-bubble.component';
import { PromptBoxComponent } from './prompt-box/prompt-box.component';
import {
  BkPromptSettings,
  PromptSettingsComponent,
} from './prompt-settings/prompt-settings.component';
import { SkeletonComponent } from '../components/skeleton/skeleton.component';
import { ActivatedRoute } from '@angular/router';
import { StateManagerService } from '../services/state-manager.service';
import { IndexedDBService } from '../services/indexed-db.service';

@Component({
  selector: 'berkeliumlabs-chat',
  imports: [
    ChatBubbleComponent,
    PromptBoxComponent,
    PromptSettingsComponent,
    SkeletonComponent,
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private stateManager = inject(StateManagerService);
  private _dbService = inject(IndexedDBService);

  chatId!: string;
  settings!: BkAppSettings;
  availableModels: BkDropdownOptions[] = [];
  promptSettings!: BkPromptSettings;
  messageThread: BkMessage[] = [];
  isLoading = false;
  isError = false;
  errorMsg = 'Error!';
  chatItem: BkChat | undefined;

  ngOnInit(): void {
    this.initChat();
  }

  private initChat(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.chatId = params['chatId'];
      if (this.chatId && this.chatId !== 'new') {
        this._dbService.getByKey<BkChat>('chats', this.chatId).subscribe((chat) => {
          this.chatItem = chat;
          this.messageThread = this.chatItem?.messages ?? [];
        });
      } else {
        this.chatItem = {
          id: Date.now().toString(),
          messages: [],
        };
        this.messageThread = [];
      }
      console.log(
        'Route Parameters:',
        this.chatId,
        this.messageThread,
        this.chatItem
      );
    });

    this._dbService.getAll<string>('models').subscribe((models) => {
      if (models) {
        models.forEach((model) => {
          const modelOption: BkDropdownOptions = {
            id: model,
            label: model,
          };

          this.availableModels.push(modelOption);
        });
      }
    });
  }

  onSettingsChanged(event: any): void {
    this.promptSettings = event;
  }

  onPromptChanged(event: any): void {
    if (this.promptSettings.model) {
      this.isError = false;
      this.messageThread.push({ role: 'you', message: event['prompt'] });
      if (typeof Worker !== 'undefined') {
        const worker = new Worker(
          new URL('../functions/prompt-handler.worker', import.meta.url)
        );

        this.isLoading = true;

        worker.onmessage = ({ data }) => {
          console.log('Response: ', data);
          const response: BkAIResponse | BkAIResponse[] = data;
          let message = '';
          if (Array.isArray(response)) {
            response.forEach((item) => {
              message += item['generated_text'];
            });
          } else {
            message = response['generated_text'];
          }
          this.messageThread.push({
            role: 'assistant',
            message: this.refineResponse(message),
            model: this.promptSettings.model,
          });
          this.isLoading = false;
          if (this.chatItem) this.chatItem.messages = this.messageThread;
          this.saveChat();
        };

        const data = {
          prompt: event['prompt'],
          ...this.promptSettings,
        };
        worker.postMessage(data);
      } else {
        this.isError = true;
        this.errorMsg = 'Web workers are not supported in this environment.';
      }
    } else {
      this.isError = true;
      this.errorMsg = 'No model selected! Please select a model.';
    }
  }

  private refineResponse(response: string): string {
    const targetWord = 'Assistant:';
    const startIndex = response.indexOf(targetWord);

    if (startIndex !== -1) {
      const extractedText = response
        .substring(startIndex + targetWord.length)
        .trim();
      return extractedText;
    } else {
      return '';
    }
  }

  private saveChat() {
    const index = this.stateManager
      .chats()
      .findIndex((chat) => chat.id === this.chatId);
    if (index !== -1) {
      this.stateManager.chats()[index].message = this.messageThread[0].message;
      this._dbService.update(
        'chats',
        this.chatItem,
        this.chatId
      );
    } else {
      if (this.chatItem) {
        this.stateManager.chats().push({
          id: this.chatItem.id,
          message: this.messageThread[0].message,
        });
        this._dbService.add(
          'chats',
          this.chatItem,
          this.chatItem?.id
        );
      }
    }
  }
}

export interface BkMessage {
  role: 'you' | 'assistant';
  message: string;
  model?: string;
}

export interface BkChat {
  id: string;
  messages: BkMessage[];
}

export interface BkAIResponse {
  generated_text: string;
}
