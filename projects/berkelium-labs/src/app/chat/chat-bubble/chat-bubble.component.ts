import { TitleCasePipe } from '@angular/common';
import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { WebSpeechService } from '../../services/web-speech.service';

@Component({
  selector: 'berkeliumlabs-chat-bubble',
  imports: [TitleCasePipe],
  templateUrl: './chat-bubble.component.html',
  styleUrl: './chat-bubble.component.scss',
})
export class ChatBubbleComponent implements OnInit {
  @Input() message: string = '';
  @Input() role: 'you' | 'assistant' = 'you';
  @Input() model: string = '';

  private webSpeechService = inject(WebSpeechService)

  isSpeaking = signal(false);

  ngOnInit(): void {
    if (this.role === 'assistant' && !this.webSpeechService.synth) {
      this.webSpeechService.initializeSpeechSynthesis();
    }
  }

  speak(): void {
    if (this.webSpeechService.synth && this.isSpeaking()) {
      this.webSpeechService.synth?.cancel();
      this.isSpeaking.set(false);
    } else {
      if (this.webSpeechService.synth && this.webSpeechService.selectedVoice) {
        const utterThis = new SpeechSynthesisUtterance(this.message);
        utterThis.voice = this.webSpeechService.selectedVoice;
        utterThis.rate = 1;
        utterThis.pitch = 1;

        utterThis.onend = () => {
          this.isSpeaking.set(false);
        };

        utterThis.onerror = (event) => {
          this.isSpeaking.set(false);
          console.error('SpeechSynthesisUtterance.onerror', event.error);
        };

        utterThis.onstart = () => {
          this.isSpeaking.set(true);
        };

        utterThis.onpause = () => {
          this.isSpeaking.set(false);
        };

        utterThis.onresume = () => {
          this.isSpeaking.set(true);
        };

        this.webSpeechService.synth.speak(utterThis);
      }
    }
  }
}
