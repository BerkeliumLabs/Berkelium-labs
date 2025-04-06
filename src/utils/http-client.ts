import axios, { AxiosError, AxiosResponse } from 'axios';

export class BerkeliumHttpClient {
  async fetchModelData(): Promise<BkHuggingfaceModelData[] | null> {
    try {
      const modelData: AxiosResponse = await axios.get(
        'https://huggingface.co/api/models',
        {
          params: {
            filter: ['transformers.js', 'text-generation'],
            sort: 'downloads',
            /* limit: 5 */
          },
        }
      );

      return modelData.data;
    } catch (error: AxiosError | Error | any) {
      if (axios.isAxiosError(error)) {
        // Handle Axios specific errors
        console.error('Axios Error:', error.message);
        console.error('Response Data (if available):', error.response?.data);
        console.error(
          'Response Status (if available):',
          error.response?.status
        );
      } else if (error instanceof Error) {
        // Handle general JavaScript errors
        console.error('General Error:', error.message);
      } else {
        console.error('Unknown error occurred:', error);
      }
      return null;
    }
  }
}
