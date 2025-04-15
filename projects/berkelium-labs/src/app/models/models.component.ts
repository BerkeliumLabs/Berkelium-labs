import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ModelItemComponent } from './model-item/model-item.component';
import { ModelManagerService } from './model-manager.service';
import { Subscription } from 'rxjs';
import { StateManagerService } from '../services/state-manager.service';

@Component({
  selector: 'berkeliumlabs-models',
  imports: [RouterLink, ModelItemComponent],
  templateUrl: './models.component.html',
  styleUrl: './models.component.scss',
  providers: [ModelManagerService],
})
export class ModelsComponent implements OnInit, OnDestroy {
  private _modelManager = inject(ModelManagerService);
  private router = inject(Router);
  private _stateManager = inject(StateManagerService);
  private $modelListSubscription!: Subscription;

  modelList!: BkHuggingfaceModelData[];

  ngOnInit(): void {
    this.initModelIncubator();
  }

  initModelIncubator(): void {
    this.$modelListSubscription = this._modelManager
      .fetchModelData()
      .subscribe({
        next: (data) => {
          this.modelList = data as BkHuggingfaceModelData[];
        },
        error: (err) => {
          console.error(err);
        },
      });
  }

  goToModel(modelData: BkHuggingfaceModelData) {
    this._stateManager.selectedModel.set(modelData);
    this.router.navigate(['models', modelData._id]);
  }

  ngOnDestroy(): void {
    if (this.$modelListSubscription) {
      this.$modelListSubscription.unsubscribe();
    }
  }
}
