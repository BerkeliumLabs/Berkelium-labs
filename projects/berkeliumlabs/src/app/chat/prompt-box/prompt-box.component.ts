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
  imports: [ReactiveFormsModule],
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
}
