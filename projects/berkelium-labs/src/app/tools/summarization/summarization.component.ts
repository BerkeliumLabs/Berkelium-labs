import { Component, inject, model, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DropdownComponent } from '../../components/dropdown/dropdown.component';
import { IndexedDBService } from '../../services/indexed-db.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'berkeliumlabs-summarization',
  imports: [RouterLink, DropdownComponent, ReactiveFormsModule],
  templateUrl: './summarization.component.html',
  styleUrl: './summarization.component.scss',
})
export class SummarizationComponent implements OnInit {
  private _dbService = inject(IndexedDBService);

  toolForm!: FormGroup;
  content = ``;
  summarizedContent = '';
  availableModels: BkDropdownOptions[] = [];
  isInitializing = true;
  inProgress = false;

  ngOnInit(): void {
    this.initTool();
  }

  private initTool(): void {
    this.toolForm = new FormGroup({
      model: new FormControl('', Validators.required),
    });

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
        this.inProgress = false;
      };

      const data = {
        content: this.content,
        model: this.toolForm.get('model')?.value,
      };
      this.inProgress = true;
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
