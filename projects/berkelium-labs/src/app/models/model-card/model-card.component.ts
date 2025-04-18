import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StateManagerService } from '../../services/state-manager.service';
import { DatePipe, DecimalPipe } from '@angular/common';
import { IndexedDBService } from '../../services/indexed-db.service';
import { ToastService } from '../../services/toast.service';

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

  modelData!: BkHuggingfaceModelData;
  progressData: any = {};
  progressBars: any[] = [];
  isDownloaded = false;
  isDownloading = false;

  ngOnInit(): void {
    this.modelData = this._stateManager.selectedModel();
    this.initModelCard();
  }

  private initModelCard() {
    if (this._stateManager.isDownloading()) {
      this.isDownloading = true;
    }

    if (this._stateManager.downloadingModelId() == this.modelData.modelId) {
      this.progressBars = this._stateManager.progressBars();
      this.progressData = this._stateManager.progressData();
    }

    this._dbService.getAll<string>('models').subscribe((models) => {
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
        new URL('../../functions/model-downloader.worker', import.meta.url)
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
      worker.postMessage(this.modelData.modelId);
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

  formatBytes(bytes: number): string {
    if (typeof bytes !== 'number' || isNaN(bytes)) {
      return 'Invalid input';
    }

    if (bytes < 1024) {
      return `${bytes} B`; // Bytes
    } else if (bytes < 1024 * 1024) {
      const kb = (bytes / 1024).toFixed(2);
      return `${kb} KB`; // Kilobytes
    } else if (bytes < 1024 * 1024 * 1024) {
      const mb = (bytes / (1024 * 1024)).toFixed(2);
      return `${mb} MB`; // Megabytes
    } else {
      const gb = (bytes / (1024 * 1024 * 1024)).toFixed(2);
      return `${gb} GB`; // Gigabytes
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

    this._dbService.getByKey('models', this.modelData.modelId ?? '').subscribe({
      next: (modelData) => {
        if (!modelData) {
          this._dbService.add(
            'models',
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

    this._dbService.getByKey('models', this.modelData.modelId ?? '').subscribe({
      next: (modelData) => {
        if (modelData) {
          this._dbService.delete('models', this.modelData.modelId ?? '');
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
