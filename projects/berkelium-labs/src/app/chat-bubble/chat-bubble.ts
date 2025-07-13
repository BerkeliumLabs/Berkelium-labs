import { TitleCasePipe } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'berkeliumlabs-chat-bubble',
  imports: [TitleCasePipe],
  templateUrl: './chat-bubble.html',
  styleUrl: './chat-bubble.scss',
})
export class ChatBubble {
  @Input() message: string = '';
  @Input() role: 'you' | 'assistant' = 'you';
}
