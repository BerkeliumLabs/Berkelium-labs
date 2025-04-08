import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'berkeliumlabs-model-item',
  imports: [DatePipe, DecimalPipe],
  templateUrl: './model-item.component.html',
  styleUrl: './model-item.component.scss'
})
export class ModelItemComponent {
  @Input() modelDownloads: Number | undefined = 0;
  @Input() modelLikes: Number | undefined = 0;
  @Input() modelName: string | undefined = 'Undefined';
  @Input() modelDate: string | undefined = Date.now().toString();
}
