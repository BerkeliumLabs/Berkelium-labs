import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StateManagerService } from '../../services/state-manager.service';

@Component({
  selector: 'berkeliumlabs-model-card',
  imports: [RouterLink],
  templateUrl: './model-card.component.html',
  styleUrl: './model-card.component.scss',
})
export class ModelCardComponent implements OnInit {
  private _stateManager = inject(StateManagerService);
  modelData!: BkHuggingfaceModelData;
  progressData: any = {};
  progressBars: any[] = [];
  isDownloaded = false;
  settings!: BkAppSettings;

  ngOnInit(): void {
    this.modelData = this._stateManager.selectedModel();
    this.initModelCard();
  }

  private initModelCard() {
    if (this._stateManager.isDownloading()) {
      this.isDownloaded = true;
    }

    window.berkelium
      .readAppSettings()
      .then((settings) => {
        if (settings) {
          this.settings = settings;
          if (settings.models?.includes(this.modelData.modelId ?? '')) {
            this.isDownloaded = true;
          }
        }
      })
      .catch((reason) => {
        console.error(reason);
      });
  }

  downloadModel() {
    if (typeof Worker !== 'undefined') {
      // Create a new
      const worker = new Worker(
        new URL('../../functions/model-downloader.worker', import.meta.url)
      );
      worker.onmessage = ({ data }) => {
        this._stateManager.isDownloading.set(true);

        if (data['status'] == 'initiate') {
          this.progressBars.push(data['file']);
        } else if (data['status'] == 'done') {
          this.progressData[data['file']]['progress'] = 100;
        } else {
          this.progressData[data['file']] = data;
        }

        if (typeof data === 'boolean') {
          if (data === true) {
            this.isDownloaded = true;
            window.berkelium.showNotification({
              title: 'Model download completed!',
              body: `${this.modelData.modelId} model downloaded successfully.`,
            });
            this.saveModelData();
          } else {
            window.berkelium.showNotification({
              title: 'Model download Failed!',
              body: `${this.modelData.modelId} model download failed.`,
            });
          }
          this._stateManager.isDownloading.set(false);
        }

        console.log(data, this.progressData);
      };
      worker.postMessage(this.modelData.modelId);
    } else {
      // Web workers are not supported in this environment.
      // You should add a fallback so that your program still executes correctly.
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
              cacheKey.startsWith(`https://huggingface.co/${this.modelData.modelId}`)
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
    const newSettings = this.settings;
    if (newSettings.models && newSettings.modelData) {
      newSettings.models.push(this.modelData.modelId ?? '');
      newSettings.modelData.push(this.modelData);
    } else {
      newSettings.models = [this.modelData.modelId ?? ''];
      newSettings.modelData = [this.modelData];
    }
    window.berkelium
      .writeAppSettings(newSettings)
      .then(() => console.log('success'))
      .catch((reason) => console.error(reason));
  }

  private deleteModelData() {
    const newSettings = this.settings;
    newSettings.models = newSettings.models?.filter((id) => id != this.modelData.modelId);
    newSettings.modelData = newSettings.modelData?.filter((model) => model.modelId != this.modelData.modelId);
    window.berkelium
      .writeAppSettings(newSettings)
      .then(() => this.initModelCard())
      .catch((reason) => console.error(reason));
  }
}
