import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DropdownComponent } from '../../components/dropdown/dropdown.component';
import { IndexedDBService } from '../../services/indexed-db.service';

@Component({
  selector: 'berkeliumlabs-summarization',
  imports: [RouterLink, DropdownComponent],
  templateUrl: './summarization.component.html',
  styleUrl: './summarization.component.scss',
})
export class SummarizationComponent implements OnInit {
  private _dbService = inject(IndexedDBService);
  content = ``;
  summarizedContent = '';
  availableModels: BkDropdownOptions[] = [];
  isInitializing = true;
  selectedModel!: string;

  ngOnInit(): void {
    this._dbService
      .getAll<string>('models-summarization')
      .subscribe((models) => {
        if (models) {
          models.forEach((model) => {
            const modelOption: BkDropdownOptions = {
              id: model,
              label: model,
            };

            this.availableModels.push(modelOption);
          });
        }
        this.isInitializing = false;
      });
  }

  onModelChange(model: BkDropdownOptions) {
    this.selectedModel = model.label;
  }

  onContentChange(event: Event) {
    const target = event.target as HTMLDivElement;
    this.content = target.innerHTML;
  }

  summarize() {
    if (typeof Worker !== 'undefined') {
      const worker = new Worker(
        new URL('../../functions/summarizer.worker', import.meta.url)
      );

      worker.onmessage = ({ data }) => {
        console.log('Response: ', data);
        this.summarizedContent = data[0].summary_text;
      };

      const data = {
        content: this.content,
        model: this.selectedModel,
      };
      worker.postMessage(data);
    } else {
      //
    }
  }

  clearContent() {
    this.content = '';
    this.summarizedContent = '';
  }
}
