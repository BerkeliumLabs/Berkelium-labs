import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DropdownComponent } from '../../components/dropdown/dropdown.component';

@Component({
  selector: 'berkeliumlabs-summarization',
  imports: [RouterLink, DropdownComponent],
  templateUrl: './summarization.component.html',
  styleUrl: './summarization.component.scss'
})
export class SummarizationComponent {
  content = `Type or paste your text here...`;
  summarizedContent = '';
  availableModels: BkDropdownOptions[] = [];

  onContentChange(event: Event) {
    const target = event.target as HTMLDivElement;
    this.content = target.innerHTML;
    console.log('Content changed:', this.content);
  }

  summarize() {
    // Implement the summarization logic here
    this.summarizedContent = this.content; // Placeholder for the actual summarization logic
    console.log('Summarizing content:', this.content);
    // For example, you could call an API to get the summary
  }
}
