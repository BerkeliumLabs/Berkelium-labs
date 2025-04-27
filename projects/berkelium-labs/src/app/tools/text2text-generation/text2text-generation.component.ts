import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DropdownComponent } from "../../components/dropdown/dropdown.component";
import { IndexedDBService } from '../../services/indexed-db.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SpinnerComponent } from "../../components/spinner/spinner.component";

@Component({
  selector: 'berkeliumlabs-text2text-generation',
  imports: [RouterLink, DropdownComponent, ReactiveFormsModule, SpinnerComponent],
  templateUrl: './text2text-generation.component.html',
  styleUrl: './text2text-generation.component.scss'
})
export class Text2textGenerationComponent implements OnInit {
  @ViewChild('textInput') textInput!: ElementRef<HTMLDivElement>;
  private _dbService = inject(IndexedDBService);

  toolForm!: FormGroup;
  content = ``;
  generatedContent = '';
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
    .getAll<string>('models-text2text-generation')
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

  generateText() {
    if (typeof Worker !== 'undefined') {
      const worker = new Worker(
        new URL('../../functions/text2text.worker', import.meta.url)
      );

      worker.onmessage = ({ data }) => {
        console.log('Response: ', data);
        this.generatedContent = data[0].generated_text;
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
    this.generatedContent = '';
    this.textInput.nativeElement.innerHTML = '';
  }
}
