import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'berkeliumlabs-prompt-box',
  imports: [ReactiveFormsModule],
  templateUrl: './prompt-box.component.html',
  styleUrl: './prompt-box.component.scss',
})
export class PromptBoxComponent implements OnInit {
  @Output() promptSend = new EventEmitter<any>();

  promptBoxForm!: FormGroup;

  ngOnInit(): void {
    this.initPromptBox();
  }

  private initPromptBox(): void {
    this.promptBoxForm = new FormGroup({
      prompt: new FormControl('', [Validators.required])
    });
  }

  sendPrompt(): void {
    this.promptSend.emit(this.promptBoxForm.value);
    console.log('Message sent', this.promptBoxForm.value);
  }
}
