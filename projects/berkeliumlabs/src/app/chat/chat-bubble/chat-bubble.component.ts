import { TitleCasePipe } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'berkeliumlabs-chat-bubble',
  imports: [TitleCasePipe],
  templateUrl: './chat-bubble.component.html',
  styleUrl: './chat-bubble.component.scss'
})
export class ChatBubbleComponent {
  @Input() message: string = '';
  @Input() role: 'you' | 'assistant' = 'you';
  @Input() model: string = '';
}
