import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StateManagerService } from '../../services/state-manager.service';

@Component({
  selector: 'berkeliumlabs-model-card',
  imports: [RouterLink],
  templateUrl: './model-card.component.html',
  styleUrl: './model-card.component.scss'
})
export class ModelCardComponent implements OnInit {
  private _stateManager = inject(StateManagerService);
  modelData!: BkHuggingfaceModelData;

  ngOnInit(): void {
    this.modelData = this._stateManager.selectedModel();
  }
}
