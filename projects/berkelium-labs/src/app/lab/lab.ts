import { Component, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FilesetResolver, LlmInference } from '@mediapipe/tasks-genai';
@Component({
  selector: 'berkeliumlabs-lab',
  imports: [MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './lab.html',
  styleUrl: './lab.scss',
})
export class Lab {
  response = signal('');
  async sendPrompt() {
    console.log('sendPrompt called');
    const genai = await FilesetResolver.forGenAiTasks(
      'wasm'
    );
    const llmInference = await LlmInference.createFromOptions(genai, {
      baseOptions: {
        modelAssetPath: 'models/gemma2-2b-it-gpu-int8.bin',
      },
      maxTokens: 1000,
      topK: 40,
      temperature: 0.8,
      randomSeed: 101,
    });

    llmInference.generateResponse('Namo buddhaya', (partialResult, done) => {
      this.response.set(this.response() + partialResult);
      console.log(this.response(), done);
    });
  }
}
