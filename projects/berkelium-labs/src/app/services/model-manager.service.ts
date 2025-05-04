import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable()
export class ModelManagerService {
  private httpClient = inject(HttpClient);

  fetchModelData() {
    const params = {
      filter: ['transformers.js'],
      sort: 'downloads',
      /* limit: 5 */
    };
    return this.httpClient.get('https://huggingface.co/api/models', {
      params: params,
    });
  }

  downloadModel(modelId: string, pipeline: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (typeof Worker !== 'undefined') {
        const worker = new Worker(
          new URL('../core/model-downloader.worker', import.meta.url)
        );
        worker.onmessage = ({ data }) => {
          if (typeof data === 'boolean') {
            resolve(data);
          } else {
            console.log('Model download progress ===>', data);
          }
        };
        worker.onerror = (error) => {
          reject(error);
          console.error('Worker error:', error);
        };
        worker.postMessage({
          modelId,
          pipeline,
        });
      } else {
        reject(false);
        console.error(
          'Error!',
          `Web workers are not supported in this environment.`
        );
      }
    });
  }
}
