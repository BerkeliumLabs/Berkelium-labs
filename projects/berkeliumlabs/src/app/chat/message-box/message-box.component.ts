import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'berkeliumlabs-message-box',
  imports: [ReactiveFormsModule],
  templateUrl: './message-box.component.html',
  styleUrl: './message-box.component.scss',
})
export class MessageBoxComponent implements OnInit {
  @Output() sendMessage = new EventEmitter<any>();

  msgBoxForm!: FormGroup;

  ngOnInit(): void {
    this.initMessageBox();
  }

  private initMessageBox(): void {
    this.msgBoxForm = new FormGroup({
      prompt: new FormControl('', [Validators.required])
    });
  }

  sendPrompt(): void {
    this.sendMessage.emit(this.msgBoxForm.value);
    console.log('Message sent', this.msgBoxForm.value);
  }
}
