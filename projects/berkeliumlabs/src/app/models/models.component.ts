import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ModelItemComponent } from './model-item/model-item.component';
import { ModelManagerService } from './model-manager.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'berkeliumlabs-models',
  imports: [RouterLink, ModelItemComponent],
  templateUrl: './models.component.html',
  styleUrl: './models.component.scss',
  providers: [ModelManagerService],
})
export class ModelsComponent implements OnInit, OnDestroy {
  private _modelManager = inject(ModelManagerService);
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

  ngOnDestroy(): void {
    if (this.$modelListSubscription) {
      this.$modelListSubscription.unsubscribe();
    }
  }
}
