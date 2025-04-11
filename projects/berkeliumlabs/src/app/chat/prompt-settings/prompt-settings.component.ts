import {
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { DropdownComponent } from '../../components/dropdown/dropdown.component';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'berkeliumlabs-prompt-settings',
  imports: [DropdownComponent, ReactiveFormsModule],
  templateUrl: './prompt-settings.component.html',
  styleUrl: './prompt-settings.component.scss',
})
export class PromptSettingsComponent implements OnInit {
  @Input() availableModels: BkDropdownOptions[] = [];
  @Output() settingsChanged = new EventEmitter<BkPromptSettings>();

  private formDestroyRef = inject(DestroyRef);
  private formUnsubscribe = new Subject<void>();

  promptSettingsForm!: FormGroup;

  ngOnInit(): void {
    this.initPromptSettings();
  }

  initPromptSettings() {
    let defaultValue: string | number = '';

    if (this.availableModels.length > 0) {
      defaultValue = this.availableModels[0].id;
    }

    this.promptSettingsForm = new FormGroup({
      model: new FormControl(defaultValue, [Validators.required]),
      temperature: new FormControl(1.0, [Validators.required]),
      topK: new FormControl(50, [Validators.required]),
      systemPrompt: new FormControl('You are a helpful assistant.', [
        Validators.required,
      ]),
    });

    this.promptSettingsForm.valueChanges
      .pipe(takeUntil(this.formUnsubscribe))
      .subscribe((value) => {
        console.log('Form value changed:', value, defaultValue);
        this.settingsChanged.emit(value);
      });

    this.formDestroyRef.onDestroy(() => {
      console.log('Component destroyed - cleaning up resources.');
      this.formUnsubscribe.next();
      this.formUnsubscribe.complete();
      // Any other cleanup logic here
    });

    this.settingsChanged.emit(this.promptSettingsForm.value);
  }
}

export interface BkPromptSettings {
  model: string;
  temperature: number;
  topK: number;
  systemPrompt: string;
}
