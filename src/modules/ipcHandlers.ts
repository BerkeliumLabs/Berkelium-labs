import { BrowserWindow, ipcMain } from "electron";
import { pipeline, PipelineType } from "@huggingface/transformers";
import { ProgressStatusInfo } from "@huggingface/transformers/types/utils/core";
import { BerkeliumHttpClient } from "../utils/http-client";
import { IHuggingfaceModelData } from "../common/interfaces/huggingface-model-data.interface";
import { BerkeliumNotifications } from "../utils/notifications";

export class BerkeliumIPCHandlers {
  mainWindow: BrowserWindow;

  constructor(appWindow: BrowserWindow) {
    this.mainWindow = appWindow;
  }

  init() {
    ipcMain.handle("run-model", async () => {
      try {
        const classifier = await pipeline(
          "sentiment-analysis",
          "Xenova/distilbert-base-uncased-finetuned-sst-2-english",
          {
            progress_callback: this.progressCallback,
          }
        );
        const result = await classifier([
          "I love transformers!",
          "I hate transformers!",
        ]);
        return result;
      } catch (error) {
        console.error("Error running model:", error);
        return { error: error.message };
      }
    });
    ipcMain.handle("get-model-data", () => this.fetchModelDataList());
    ipcMain.handle("download-model", (_evt, modelId) => {
      this.downloadModel(modelId);
    });
    console.log("Main window", this.mainWindow);
  }

  private progressCallback(progress: ProgressStatusInfo) {
    // progress status: initiate -> download -> progress -> done
    this.mainWindow.webContents.send("download-progress", {
      progress,
    });
    console.clear();
    console.log(progress);
  }

  private async fetchModelDataList(): Promise<IHuggingfaceModelData[]> | null {
    try {
      const httpClient = new BerkeliumHttpClient();
      const data = await httpClient.fetchModelData();
      return data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  private async downloadModel(
    modelId: string,
    pipelineType: PipelineType = "text-generation"
  ): Promise<void> {
    const notify = new BerkeliumNotifications();
    try {
      await pipeline(pipelineType, modelId, {
        progress_callback: this.progressCallback.bind(this),
      });
      notify.show({
        title: "Model download completed!",
        body: `${modelId} model downloaded successfully.`,
      });
      this.mainWindow.webContents.send("download-status", {
        isDownloading: false
      });
    } catch (error) {
      notify.show({
        title: "Model download Failed!",
        body: `${modelId} model download failed.\nError: ${error}`,
      });
      console.error(`Error downloading model:\n${error}`);
      this.mainWindow.webContents.send("download-status", {
        isDownloading: false
      });
    }
  }
}
