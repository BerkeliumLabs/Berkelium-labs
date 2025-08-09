import { AfterViewInit, Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { FilesetResolver, LlmInference } from '@mediapipe/tasks-genai';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

@Component({
  selector: 'berkeliumlabs-root',
  imports: [
    CommonModule,
    FormsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatProgressBarModule,
    MatSnackBarModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit, AfterViewInit {
  @ViewChild('chatContainer') chatContainer!: ElementRef;

  messages: Message[] = [];
  currentMessage: string = '';
  modelLoaded: boolean = false;
  isGenerating: boolean = false;
  isInitializing: boolean = false;

  private llmInference: LlmInference | null = null;
  private messageIdCounter = 0;

  constructor(private snackBar: MatSnackBar) {}

  ngOnInit() {
    // Auto-initialize model on app start
    this.initializeModel();
  }

  ngAfterViewInit() {
    // Scroll to bottom when view initializes
    this.scrollToBottom();
  }

  async initializeModel() {
    if (this.isInitializing) return;

    this.isInitializing = true;
    this.modelLoaded = false;

    const genai = await FilesetResolver.forGenAiTasks('wasm');

    try {
      // Initialize the LLM inference
      this.llmInference = await LlmInference.createFromOptions(genai, {
        baseOptions: {
          modelAssetPath:
            'models/gemma2-2b-it-gpu-int8.bin',
        },
        maxTokens: 1000,
        topK: 40,
        temperature: 0.8,
        randomSeed: 101,
      });

      this.modelLoaded = true;
      this.showSnackBar('Model loaded successfully!', 'success');
    } catch (error) {
      console.error('Failed to initialize model:', error);
      this.showSnackBar('Failed to load model. Please try again.', 'error');
    } finally {
      this.isInitializing = false;
    }
  }

  async sendMessage() {
    if (!this.currentMessage.trim() || !this.modelLoaded || this.isGenerating) {
      return;
    }

    const userMessage = this.currentMessage.trim();
    this.currentMessage = '';

    // Add user message
    this.addMessage(userMessage, true);

    // Start generating response
    this.isGenerating = true;

    try {
      if (!this.llmInference) {
        throw new Error('Model not initialized');
      }

      // Generate response using MediaPipe GenAI
      const response = await this.llmInference.generateResponse(userMessage);
      console.log('Generated response:', response);
      // Add AI response
      this.addMessage(response, false);
    } catch (error) {
      console.error('Error generating response:', error);
      this.addMessage(
        'Sorry, I encountered an error. Please try again.',
        false
      );
      this.showSnackBar('Error generating response', 'error');
    } finally {
      this.isGenerating = false;
    }
  }

  addMessage(text: string, isUser: boolean) {
    const message: Message = {
      id: this.messageIdCounter++,
      text: text,
      isUser: isUser,
      timestamp: new Date(),
    };

    this.messages.push(message);

    // Scroll to bottom after adding message
    setTimeout(() => this.scrollToBottom(), 100);
  }

  onEnterPress(event: Event) {
    if ((event as KeyboardEvent).key === 'Enter' && !(event as KeyboardEvent).shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  clearChat() {
    this.messages = [];
    this.showSnackBar('Chat cleared', 'info');
  }

  private scrollToBottom() {
    if (this.chatContainer) {
      const element = this.chatContainer.nativeElement;
      element.scrollTop = element.scrollHeight;
    }
  }

  private showSnackBar(message: string, type: 'success' | 'error' | 'info') {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: [`snackbar-${type}`],
    });
  }
}
