import { Component, OnInit } from '@angular/core';
import { ChatBubbleComponent } from './chat-bubble/chat-bubble.component';
import { PromptBoxComponent } from './prompt-box/prompt-box.component';
import { PromptSettingsComponent } from './prompt-settings/prompt-settings.component';
import { TextGenerationOutput } from '@huggingface/transformers';

@Component({
  selector: 'berkeliumlabs-chat',
  imports: [ChatBubbleComponent, PromptBoxComponent, PromptSettingsComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent implements OnInit {
  settings!: BkAppSettings;
  availableModels: BkDropdownOptions[] = [];
  promptSettings: any;
  messageThread: BkMessage[] = [];

  ngOnInit(): void {
    this.initChat();
  }

  private initChat(): void {
    window.berkelium
      .readAppSettings()
      .then((settings) => {
        if (settings) {
          this.settings = settings;
          if (settings.models) {
            settings.models.forEach((model) => {
              const modelOption: BkDropdownOptions = {
                id: model,
                label: model,
              };

              this.availableModels.push(modelOption);
            });
          }
        }
      })
      .catch((reason) => {
        console.error(reason);
      });
  }

  onSettingsChanged(event: any): void {
    this.promptSettings = event;
  }

  onPromptChanged(event: any): void {
    this.messageThread.push({ role: 'you', message: event['prompt'] });
    if (typeof Worker !== 'undefined') {
      const worker = new Worker(
        new URL('../functions/prompt-handler.worker', import.meta.url)
      );
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
        this.messageThread.push({ role: 'assistant', message: this.refineResponse(message) });
      };

      const data = {
        prompt: event['prompt'],
        ...this.promptSettings,
      };
      worker.postMessage(data);
    } else {
      // Web workers are not supported in this environment.
      // You should add a fallback so that your program still executes correctly.
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
}

export interface BkMessage {
  role: 'you' | 'assistant';
  message: string;
}

export interface BkAIResponse {
  generated_text: string;
}
