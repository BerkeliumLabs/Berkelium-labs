import { NgClass } from '@angular/common';
import {
  Component,
  computed,
  effect,
  EventEmitter,
  Input,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'berkeliumlabs-prompt-box',
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './prompt-box.component.html',
  styleUrl: './prompt-box.component.scss',
})
export class PromptBoxComponent implements OnInit {
  @Input() set disabled(value: boolean) {
    this.isDisabled.set(value);
  }
  @Output() promptSend = new EventEmitter<any>();

  promptBoxForm!: FormGroup;
  isDisabled = signal(false);
  textareaControl = computed(() => this.promptBoxForm.get('prompt'));
  recognition: any;
  isRecording = signal(false);

  constructor() {
    effect(() => {
      if (this.textareaControl()) {
        if (this.isDisabled()) {
          this.textareaControl()?.disable();
        } else {
          this.textareaControl()?.enable();
        }
      }
    });
  }

  ngOnInit(): void {
    this.initPromptBox();
    this.initMediaRecorder();
  }

  private initPromptBox(): void {
    this.promptBoxForm = new FormGroup({
      prompt: new FormControl({ value: '', disabled: this.disabled }, [
        Validators.required,
      ]),
    });
  }

  sendPrompt(): void {
    this.promptSend.emit(this.promptBoxForm.value);
    this.promptBoxForm.reset();
  }

  startRecording(): void {
    if (this.isRecording()) {
      this.recognition.stop();
    } else {
      this.promptBoxForm.get('prompt')?.setValue('');
      this.recognition.start();
    }
  }

  private initMediaRecorder(): void {
    if ('webkitSpeechRecognition' in window || 'speechRecognition' in window) {
      // Use the correct SpeechRecognition constructor based on the browser
      const SpeechRecognition = window.webkitSpeechRecognition || window.speechRecognition;
      this.recognition = new SpeechRecognition();
    
      // Optional settings
      this.recognition.continuous = true; // Keep listening even after a pause
      this.recognition.interimResults = true; // Get partial results as the user speaks
      this.recognition.lang = 'en-US'; // Set the language
    
      let finalTranscript = '';
    
      this.recognition.onstart = () => {
        // console.log('Speech recognition started.', this.recognition);
        this.isRecording.set(true);
      };
    
      this.recognition.onresult = (event: any) => {
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
            this.promptBoxForm.get('prompt')?.setValue(finalTranscript);
          } else {
            interimTranscript += event.results[i][0].transcript;
            this.promptBoxForm.get('prompt')?.setValue(interimTranscript);
          }
        }
        /* console.log('Interim Transcript:', interimTranscript, event);
        console.log('Final Transcript:', finalTranscript, this.recognition); */
      };

      this.recognition.onend = () => {
        // console.log('Speech recognition ended.');
        this.isRecording.set(false);
      }

      this.recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event);
        this.isRecording.set(false);
      };

    } else {
      console.error('getUserMedia not supported on your browser!');
    }
  }
}
