import {
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ChatBubbleComponent } from './chat-bubble/chat-bubble.component';
import { PromptBoxComponent } from './prompt-box/prompt-box.component';
import {
  BkPromptSettings,
  PromptSettingsComponent,
} from './prompt-settings/prompt-settings.component';
import { SkeletonComponent } from '../components/skeleton/skeleton.component';
import { ActivatedRoute, Router } from '@angular/router';
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
  @ViewChild('chatContainer') private chatContainer!: ElementRef;

  private activatedRoute = inject(ActivatedRoute);
  private stateManager = inject(StateManagerService);
  private _dbService = inject(IndexedDBService);
  private router = inject(Router);

  chatId!: string;
  availableModels: BkDropdownOptions[] = [];
  promptSettings!: BkPromptSettings;
  messageThread: BkMessage[] = [];
  isLoading = false;
  isError = false;
  isInitializing = true;
  errorMsg = 'Error!';
  chatItem: BkChat | undefined;

  ngOnInit(): void {
    this.initChat();
  }

  private initChat(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.chatId = params['chatId'];
      if (this.chatId && this.chatId !== 'new') {
        this._dbService
          .getByKey<BkChat>('chats', this.chatId)
          .subscribe((chat) => {
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
      this.stateManager.activeChatId.set(this.chatId ?? 'new');
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
      this.isInitializing = false;
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
          new URL('../core/prompt-handler.worker', import.meta.url)
        );

        this.isLoading = true;

        worker.onmessage = ({ data }) => {
          // console.log('Response: ', data);
          const response: BkAIResponse | BkAIResponse[] | string = data;
          this.isLoading = false;
          let message = this.refineResponse(response);
          if (message.includes('Error running model')) {
            this.errorMsg = message;
            this.isError = true;
          } else {
            this.messageThread.push({
              role: 'assistant',
              message: message,
              model: this.promptSettings.model,
            });
            if (this.chatItem) this.chatItem.messages = this.messageThread;
            this.saveChat();
          }

          this.scrollToBottom();
        };

        const data = {
          prompt: event['prompt'],
          ...this.promptSettings,
        };

        setTimeout(() => {
          this.scrollToBottom();
          worker.postMessage(data);
        }, 100);
      } else {
        this.isError = true;
        this.errorMsg = 'Web workers are not supported in this environment.';
      }
    } else {
      this.isError = true;
      this.errorMsg = 'No model selected! Please select a model.';
    }
  }

  private refineResponse(
    response: BkAIResponse | BkAIResponse[] | string
  ): string {
    let message = '';
    if (Array.isArray(response)) {
      response.forEach((item) => {
        if (Array.isArray(item['generated_text'])) {
          const reply = item['generated_text'].at(-1);
          message = reply?.content ?? '';
        } else {
          message = item['generated_text'];
        }
      });
    } else {
      message = response as string;
    }

    return message;
  }

  private saveChat() {
    const index = this.stateManager
      .chats()
      .findIndex((chat) => chat.id === this.chatItem?.id);
    if (index !== -1 && this.chatItem) {
      this._dbService.update('chats', this.chatItem, this.chatItem?.id);
    } else {
      if (this.chatItem) {
        this.stateManager.addChat({
          id: this.chatItem.id,
          message: this.messageThread[0].message.slice(0, 50),
        });
        this._dbService.add('chats', this.chatItem, this.chatItem?.id);
      }
    }
    this.router.navigate([`chat/${this.chatItem?.id}`]);
  }

  private scrollToBottom(): void {
    const msgContainer = this.chatContainer.nativeElement as HTMLDivElement;
    try {
      msgContainer.scrollTop = msgContainer.scrollHeight + 150;
    } catch (err) {
      console.error(err);
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
  generated_text: string | Array<{ role: string; content: string }>;
}
