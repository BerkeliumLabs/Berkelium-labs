import { Component, inject, OnInit, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FilesetResolver, LlmInference } from '@mediapipe/tasks-genai';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
@Component({
  selector: 'berkeliumlabs-lab',
  imports: [MatCardModule, MatButtonModule, MatIconModule, ReactiveFormsModule],
  templateUrl: './lab.html',
  styleUrl: './lab.scss',
})
export class Lab implements OnInit {
  private llmInference!: LlmInference;
  response = signal('');
  chatHistory = signal<string[]>([]);
  chatForm!: FormGroup;

  ngOnInit(): void {
    this.chatForm = new FormGroup({
      prompt: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.minLength(1)]),
    });

    this.initLlmInference().then(() => {
      console.log('LlmInference initialized');
      this.chatForm.get('prompt')?.enable();
    }).catch(error => {
      console.error('Error initializing LlmInference:', error);
    });
  }

  private async initLlmInference() {
    const genai = await FilesetResolver.forGenAiTasks(
      'wasm'
    );

    this.llmInference = await LlmInference.createFromOptions(genai, {
      baseOptions: {
        modelAssetPath: 'models/gemma2-2b-it-gpu-int8.bin',
      },
      maxTokens: 1000,
      topK: 40,
      temperature: 0.8,
      randomSeed: 101,
    });
  }

  async sendPrompt() {
    const prompt = this.chatForm.get('prompt')?.value;
    const message = {
      role: 'you',
      content: prompt,
    };
    this.chatHistory.set([...this.chatHistory(), message.content]);
    this.llmInference.generateResponse(prompt, (partialResult, done) => {
      this.response.set(this.response() + partialResult);
      console.log(this.response(), done);
    });
  }
}
