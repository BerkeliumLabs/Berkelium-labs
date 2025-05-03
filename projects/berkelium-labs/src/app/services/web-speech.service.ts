import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WebSpeechService {

  synth: SpeechSynthesis | null = null;
  selectedVoice: SpeechSynthesisVoice | undefined;

  initializeSpeechSynthesis(): void {
    if (window.speechSynthesis) {
      this.synth = window.speechSynthesis;
      this.setVoice();
      this.synth.onvoiceschanged = this.setVoice.bind(this);
    } else {
      console.warn('Speech synthesis not supported in this browser.');
    }
  }

  private setVoice(): void {
    const voices = this.synth?.getVoices() || [];
    // console.log('Available voices:', voices);
    if (voices.length > 0) {
      this.selectedVoice = voices.find((voice) => voice.lang === 'en-US');

      if (!this.selectedVoice) {
        this.selectedVoice = voices[0]; // Fallback to the first available voice
        console.warn(
          'Could not find a specific en-US voice. Using the first available voice.'
        );
      }
    } else {
      console.warn('No speech synthesis voices available.');
    }
  }
}
