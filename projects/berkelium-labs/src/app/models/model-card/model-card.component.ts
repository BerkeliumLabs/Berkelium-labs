import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StateManagerService } from '../../services/state-manager.service';
import { DatePipe, DecimalPipe } from '@angular/common';
import { IndexedDBService } from '../../services/indexed-db.service';
import { ToastService } from '../../services/toast.service';
import { UtilityService } from '../../services/utility.service';

@Component({
  selector: 'berkeliumlabs-model-card',
  imports: [RouterLink, DecimalPipe, DatePipe],
  templateUrl: './model-card.component.html',
  styleUrl: './model-card.component.scss',
})
export class ModelCardComponent implements OnInit {
  private _stateManager = inject(StateManagerService);
  private _dbService = inject(IndexedDBService);
  private _toastService = inject(ToastService);
  public _utilityService = inject(UtilityService);

  modelData!: BkHuggingfaceModelData;
  progressData: any = {};
  progressBars: any[] = [];
  isDownloaded = false;
  isDownloading = false;
  modelStoreName = 'models';

  ngOnInit(): void {
    this.modelData = this._stateManager.selectedModel();
    this.initModelCard();
  }

  private initModelCard() {
    if (this.modelData.pipeline_tag !== 'text-generation') {
      this.modelStoreName = 'models-' + this.modelData.pipeline_tag;
    }

    if (this._stateManager.isDownloading()) {
      this.isDownloading = true;
    }

    if (this._stateManager.downloadingModelId() == this.modelData.modelId) {
      this.progressBars = this._stateManager.progressBars();
      this.progressData = this._stateManager.progressData();
    }

    this._dbService.getAll<string>(this.modelStoreName).subscribe((models) => {
      if (models?.includes(this.modelData.modelId ?? '')) {
        this.isDownloaded = true;

        this._dbService
          .getByKey('modelFiles', this.modelData.modelId ?? '')
          .subscribe({
            next: (data: any) => {
              if (data) {
                this.progressBars = data['progressBars'] ?? this.progressBars;
                this.progressData = data['progressData'] ?? this.progressData;
              }
            },
            error: (error) => console.error(error),
          });
      }
      // console.log('Model data: ', models);
    });
  }

  downloadModel() {
    if (typeof Worker !== 'undefined') {
      const worker = new Worker(
        new URL('../../core/model-downloader.worker', import.meta.url)
      );
      worker.onmessage = ({ data }) => {
        this._stateManager.isDownloading.set(true);
        this._stateManager.downloadingModelId.set(this.modelData.modelId ?? '');

        if (data['status'] == 'initiate') {
          this.progressBars.push(data['file']);
          this._stateManager.progressBars.set(this.progressBars);
        } else if (data['status'] == 'done') {
          this.progressData[data['file']]['progress'] = 100;
        } else {
          this.progressData[data['file']] = data;
        }

        this._stateManager.progressData.set(this.progressData);

        if (typeof data === 'boolean') {
          if (data === true) {
            this.isDownloaded = true;
            this.saveModelData();
            this._toastService.success(
              'Success!',
              `${this.modelData.modelId} model downloaded successfully`
            );
          } else {
            this.isDownloading = false;
            this._toastService.error(
              'Error!',
              `${this.modelData.modelId} model download failed`
            );
          }
          this._stateManager.isDownloading.set(false);
          this._stateManager.progressBars.set([]);
          this._stateManager.progressData.set({});
          this._stateManager.downloadingModelId.set('');
        }

        // console.log(data, this.progressData);
      };
      worker.postMessage({
        modelId: this.modelData.modelId,
        pipeline: this.modelData.pipeline_tag,
      });
    } else {
      this._toastService.error(
        'Error!',
        `Web workers are not supported in this environment.`
      );
    }
  }

  deleteModel() {
    if ('caches' in window) {
      caches
        .open('transformers-cache')
        .then((cache) => {
          return cache.keys(); // Get all cache keys
        })
        .then((keys) => {
          keys.forEach((request) => {
            const cacheKey = request.url || request;
            if (
              typeof cacheKey === 'string' &&
              cacheKey.startsWith(
                `https://huggingface.co/${this.modelData.modelId}`
              )
            ) {
              caches
                .open('transformers-cache')
                .then((cacheToDeleteFrom) => {
                  return cacheToDeleteFrom.delete(request);
                })
                .then((deleted) => {
                  if (deleted) {
                    this.deleteModelData();
                    console.log(`Cache entry '${cacheKey}' deleted.`);
                  } else {
                    console.log(`Cache entry '${cacheKey}' not found.`);
                  }
                });
            }
          });
        });
    }
  }

  roundOffProgress(value: number): number {
    if (typeof value == 'number') {
      return parseFloat(value.toFixed(2));
    } else {
      return 0;
    }
  }

  private saveModelData() {
    this._dbService
      .getByKey('modelData', this.modelData.modelId ?? '')
      .subscribe({
        next: (modelData) => {
          if (!modelData) {
            this._dbService.add(
              'modelData',
              this.modelData,
              this.modelData.modelId ?? ''
            );
          }
        },
        error: (error) => console.error(error),
      });

    this._dbService
      .getByKey(this.modelStoreName, this.modelData.modelId ?? '')
      .subscribe({
        next: (modelData) => {
          if (!modelData) {
            this._dbService.add(
              this.modelStoreName,
              this.modelData.modelId,
              this.modelData.modelId ?? ''
            );
          }
        },
        error: (error) => console.error(error),
      });

    this._dbService
      .getByKey('modelFiles', this.modelData.modelId ?? '')
      .subscribe({
        next: (data) => {
          if (!data) {
            const modelFiles = {
              progressBars: this.progressBars,
              progressData: this.progressData,
            };
            this._dbService.add(
              'modelFiles',
              modelFiles,
              this.modelData.modelId ?? ''
            );
          }
        },
        error: (error) => console.error(error),
      });
  }

  private deleteModelData() {
    this._dbService
      .getByKey('modelData', this.modelData.modelId ?? '')
      .subscribe({
        next: (modelData) => {
          if (modelData) {
            this._dbService.delete('modelData', this.modelData.modelId ?? '');
          }
        },
        error: (error) => console.error(error),
      });

    this._dbService
      .getByKey(this.modelStoreName, this.modelData.modelId ?? '')
      .subscribe({
        next: (modelData) => {
          if (modelData) {
            this._dbService.delete(
              this.modelStoreName,
              this.modelData.modelId ?? ''
            );
          }
        },
        error: (error) => console.error(error),
      });

    this._dbService
      .getByKey('modelFiles', this.modelData.modelId ?? '')
      .subscribe({
        next: (data) => {
          if (data) {
            this._dbService.delete('modelFiles', this.modelData.modelId ?? '');
          }
        },
        error: (error) => console.error(error),
      });

    this.isDownloaded = false;
    this.progressBars = [];
    this.progressData = {};
    this._toastService.success(
      'Success!',
      `${this.modelData.modelId} model deleted`
    );
  }
}
