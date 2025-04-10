import { Component, OnInit } from '@angular/core';
import { ChatBubbleComponent } from './chat-bubble/chat-bubble.component';
import { PromptBoxComponent } from './prompt-box/prompt-box.component';
import { PromptSettingsComponent } from './prompt-settings/prompt-settings.component';

@Component({
  selector: 'berkeliumlabs-chat',
  imports: [ChatBubbleComponent, PromptBoxComponent, PromptSettingsComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent implements OnInit {
  settings!: BkAppSettings;
  availableModels: BkDropdownOptions[] = [];

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

  onSettingsChanged(event: any): void {}

  onPromptChanged(event: any): void {
    if (typeof Worker !== 'undefined') {
      const worker = new Worker(
        new URL('../functions/prompt-handler.worker', import.meta.url)
      );
      worker.onmessage = ({ data }) => {        
        console.log('worker: ', data);
      };
      worker.postMessage(event['prompt']);
    } else {
      // Web workers are not supported in this environment.
      // You should add a fallback so that your program still executes correctly.
    }
  }
}
