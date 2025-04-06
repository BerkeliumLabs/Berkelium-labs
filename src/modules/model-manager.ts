import {
  pipeline,
  PipelineType,
  ProgressInfo,
} from '@huggingface/transformers';
import { BerkeliumHttpClient } from '../utils/http-client';
import { BerkeliumNotifications } from '../utils/notifications';
import { BrowserWindow } from 'electron';

export class BerkeliumModelManager {
  mainWindow: BrowserWindow;

  constructor(appWindow: BrowserWindow) {
    this.mainWindow = appWindow;
  }

  async fetchModelDataList(): Promise<BkHuggingfaceModelData[] | null> {
    try {
      const httpClient = new BerkeliumHttpClient();
      const data = await httpClient.fetchModelData();
      return data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async downloadModel(
    modelId: string,
    pipelineType: PipelineType = 'text-generation'
  ): Promise<void> {
    const notify = new BerkeliumNotifications();
    try {
      await pipeline(pipelineType, modelId, {
        progress_callback: this.progressCallback.bind(this),
      });
      notify.show({
        title: 'Model download completed!',
        body: `${modelId} model downloaded successfully.`,
      });
      this.mainWindow.webContents.send('download-status', {
        isDownloading: false,
      });
    } catch (error) {
      notify.show({
        title: 'Model download Failed!',
        body: `${modelId} model download failed.\nError: ${error}`,
      });
      console.error(`Error downloading model:\n${error}`);
      this.mainWindow.webContents.send('download-status', {
        isDownloading: false,
      });
    }
  }

  private progressCallback(progress: ProgressInfo) {
    // progress status: initiate -> download -> progress -> done
    this.mainWindow.webContents.send('download-progress', {
      progress,
    });
  }
}
