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
}
