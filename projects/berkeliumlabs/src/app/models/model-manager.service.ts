import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { pipeline, PipelineType, ProgressCallback } from '@huggingface/transformers';

@Injectable()
export class ModelManagerService {
  private httpClient = inject(HttpClient);

  fetchModelData() {
    const params = {
      filter: ['transformers.js', 'text-generation'],
      sort: 'downloads',
      /* limit: 5 */
    };
    return this.httpClient.get('https://huggingface.co/api/models', {
      params: params,
    });
  }

  async downloadModel(
    modelId: string,
    pipelineType: PipelineType = 'text-generation',
    progressCallback: ProgressCallback
  ): Promise<void> {
    /* const notify = new BerkeliumNotifications(); */
    try {
      await pipeline(pipelineType, modelId, {
        progress_callback: progressCallback,
      });
      /* notify.show({
        title: 'Model download completed!',
        body: `${modelId} model downloaded successfully.`,
      }); */
    } catch (error) {
      /* notify.show({
        title: 'Model download Failed!',
        body: `${modelId} model download failed.\nError: ${error}`,
      }); */
      console.error(`Error downloading model:\n${error}`);
    }
  }
}
