import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ModelItemComponent } from './model-item/model-item.component';
import { ModelManagerService } from '../services/model-manager.service';
import {
  debounceTime,
  distinctUntilChanged,
  Subject,
  Subscription,
  takeUntil,
} from 'rxjs';
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
  private modelList!: BkHuggingfaceModelData[];

  filteredModelList!: BkHuggingfaceModelData[];
  displayModelList!: BkHuggingfaceModelData[];
  filter$ = new Subject<string>();
  isInitialized = false;
  pageSize = 20;
  currentPage = 1;
  totalPages = 1;
  searchTerm = '';
  pipeline = 'text-generation';

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
          /* this.filteredModelList = this.modelList;
          this.updateDisplayedList();
          this.isInitialized = true; */
          this.triggerFilter();
        },
        error: (err) => {
          this.isInitialized = true;
          console.error(err);
        },
      });

    this.filter$
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((action) => {
        if (this.worker) {
          this.triggerFilter();
        }
      });
  }

  onSearchInput(evt: Event): void {
    const searchInput = evt.target as HTMLInputElement;
    this.searchTerm = searchInput.value;
    this.filter$.next(searchInput.value);
  }

  onTaskSelected(evt: Event): void {
    const taskSelect = evt.target as HTMLSelectElement;
    this.pipeline = taskSelect.value;
    this.triggerFilter();
    // console.log(taskSelect.value);
  }

  private updateDisplayedList(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.displayModelList = this.filteredModelList.slice(startIndex, endIndex);
    this.totalPages =
      Math.ceil(this.filteredModelList.length / this.pageSize) || 1;
  }

  goToPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateDisplayedList();
    }
  }

  goToNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateDisplayedList();
    }
  }

  goToModel(modelData: BkHuggingfaceModelData) {
    this._stateManager.selectedModel.set(modelData);
    this.router.navigate(['models', modelData._id]);
  }

  private triggerFilter(): void {
    if (this.worker) {
      this.worker.postMessage({
        searchTerm: this.searchTerm,
        modelList: this.modelList,
        pipeline: this.pipeline,
      });
    }
  }

  private initializeModelListFilter() {
    if (typeof Worker !== 'undefined') {
      this.worker = new Worker(
        new URL('../core/model-filter.worker', import.meta.url)
      );

      this.worker.onmessage = ({ data }) => {
        this.filteredModelList = data;
        this.currentPage = 1;
        this.updateDisplayedList();
        this.isInitialized = true;
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
