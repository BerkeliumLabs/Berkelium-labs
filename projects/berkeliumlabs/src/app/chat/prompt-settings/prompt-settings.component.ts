import { Component, Input } from '@angular/core';
import { DropdownComponent } from '../../components/dropdown/dropdown.component';

@Component({
  selector: 'berkeliumlabs-prompt-settings',
  imports: [DropdownComponent],
  templateUrl: './prompt-settings.component.html',
  styleUrl: './prompt-settings.component.scss',
})
export class PromptSettingsComponent {
  @Input() availableModels: BkDropdownOptions[] = [];
}
