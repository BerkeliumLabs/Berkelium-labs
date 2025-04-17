import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ModelItemComponent } from './model-item/model-item.component';
import { ModelManagerService } from '../services/model-manager.service';
import { debounceTime, distinctUntilChanged, Subject, Subscription, takeUntil } from 'rxjs';
import { StateManagerService } from '../services/state-manager.service';
import { SpinnerComponent } from '../components/spinner/spinner.component';

@Component({
  selector: 'berkeliumlabs-models',
  imports: [RouterLink, ModelItemComponent, SpinnerComponent],
  templateUrl: './models.component.html',
  styleUrl: './models.component.scss',
  providers: [ModelManagerService],
})
export class ModelsComponent implements OnInit, OnDestroy {
  private _modelManager = inject(ModelManagerService);
  private router = inject(Router);
  private _stateManager = inject(StateManagerService);
  private $modelListSubscription!: Subscription;
  private worker!: Worker;
  private destroy$ = new Subject<void>();

  modelList!: BkHuggingfaceModelData[];
  filteredModelList!: BkHuggingfaceModelData[];
  searchTerm$ = new Subject<string>();

  ngOnInit(): void {
    this.initializeModelListFilter();
    this.initModelIncubator();
  }

  initModelIncubator(): void {
    this.$modelListSubscription = this._modelManager
      .fetchModelData()
      .subscribe({
        next: (data) => {
          this.modelList = data as BkHuggingfaceModelData[];
          this.filteredModelList = this.modelList;
        },
        error: (err) => {
          console.error(err);
        },
      });

    this.searchTerm$
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((term) => {
        if (this.worker) {
          this.worker.postMessage({
            searchTerm: term,
            modelList: this.modelList,
          });
        }
      });
  }

  onSearchInput(evt: Event): void {
    const searchInput = evt.target as HTMLInputElement;
    this.searchTerm$.next(searchInput.value);
    console.log(searchInput.value);
  }

  goToModel(modelData: BkHuggingfaceModelData) {
    this._stateManager.selectedModel.set(modelData);
    this.router.navigate(['models', modelData._id]);
  }

  private initializeModelListFilter() {
    if (typeof Worker !== 'undefined') {
      this.worker = new Worker(
        new URL('../functions/model-filter.worker', import.meta.url)
      );

      this.worker.onmessage = ({ data }) => {
        this.filteredModelList = data;
      };

      this.worker.onerror = (error) => {
        console.error('Web Worker Error:', error);
      };
    } else {
      /* this._toastService.error(
        'Error!',
        `Web workers are not supported in this environment.`
      ); */
    }
  }

  ngOnDestroy(): void {
    if (this.$modelListSubscription) {
      this.$modelListSubscription.unsubscribe();
    }
    if (this.worker) {
      this.worker.terminate(); // Clean up the worker
    }
    this.destroy$.next();
    this.destroy$.complete();
  }
}
