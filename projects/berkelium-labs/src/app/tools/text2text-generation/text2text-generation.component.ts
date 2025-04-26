import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DropdownComponent } from "../../components/dropdown/dropdown.component";
import { IndexedDBService } from '../../services/indexed-db.service';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'berkeliumlabs-text2text-generation',
  imports: [RouterLink, DropdownComponent],
  templateUrl: './text2text-generation.component.html',
  styleUrl: './text2text-generation.component.scss'
})
export class Text2textGenerationComponent {
  private _dbService = inject(IndexedDBService);

  toolForm!: FormGroup;
  content = ``;
  summarizedContent = '';
  availableModels: BkDropdownOptions[] = [];
  isInitializing = true;
  inProgress = false;
}
