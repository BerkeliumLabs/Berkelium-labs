import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IndexedDBService } from '../../services/indexed-db.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DropdownComponent } from "../../components/dropdown/dropdown.component";
import { SpinnerComponent } from "../../components/spinner/spinner.component";

@Component({
  selector: 'berkeliumlabs-translation',
  imports: [RouterLink, DropdownComponent, SpinnerComponent, ReactiveFormsModule],
  templateUrl: './translation.component.html',
  styleUrl: './translation.component.scss'
})
export class TranslationComponent implements OnInit {
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
    .getAll<string>('models-translation')
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

  translator() {
    if (typeof Worker !== 'undefined') {
      const worker = new Worker(
        new URL('../../functions/translate.worker', import.meta.url)
      );

      worker.onmessage = ({ data }) => {
        // console.log('Response: ', data);
        this.generatedContent = data[0].translation_text;
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
