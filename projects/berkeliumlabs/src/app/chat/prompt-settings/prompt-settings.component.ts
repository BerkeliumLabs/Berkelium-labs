import { Component, DestroyRef, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { DropdownComponent } from '../../components/dropdown/dropdown.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'berkeliumlabs-prompt-settings',
  imports: [DropdownComponent, ReactiveFormsModule],
  templateUrl: './prompt-settings.component.html',
  styleUrl: './prompt-settings.component.scss',
})
export class PromptSettingsComponent implements OnInit {
  @Input() availableModels: BkDropdownOptions[] = [];
  @Output() settingsChanged = new EventEmitter<any>();
  
  private formDestroyRef = inject(DestroyRef);
  private formUnsubscribe = new Subject<void>();

  promptSettingsForm!: FormGroup;

  ngOnInit(): void {
    this.initPromptSettings();
  }

  initPromptSettings() {
    this.promptSettingsForm = new FormGroup({
      model: new FormControl('', [Validators.required])
    });

    this.promptSettingsForm.valueChanges
    .pipe(takeUntil(this.formUnsubscribe))
    .subscribe(value => {
      console.log('Form value changed:', value);
      this.settingsChanged.emit(value);
    });

    this.formDestroyRef.onDestroy(() => {
      console.log('Component destroyed - cleaning up resources.');
      this.formUnsubscribe.next();
      this.formUnsubscribe.complete();
      // Any other cleanup logic here
    });
  }
}
