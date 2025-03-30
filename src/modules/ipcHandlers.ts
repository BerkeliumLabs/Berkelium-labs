import { ipcMain } from "electron";
import { pipeline, PipelineType } from "@huggingface/transformers";
import { ProgressStatusInfo } from "@huggingface/transformers/types/utils/core";
import { BerkeliumHttpClient } from "../utils/http-client";
import { IHuggingfaceModelData } from "../common/interfaces/huggingface-model-data.interface";

export class BerkeliumIPCHandlers {
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
    ipcMain.handle('get-model-data', () => this.fetchModelDataList());
  }

  private progressCallback(progress: ProgressStatusInfo) {
    console.log(`Status: ${progress.status}`);
    console.log(`File: ${progress.file}`);
    if (progress.progress) console.log(`Progress: ${progress.progress}%`);
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
  ) {
    try {
      await pipeline(pipelineType, modelId, {
        progress_callback: this.progressCallback,
      });
    } catch (error) {
      console.error(`Error downloading model:\n${error}`);
    }
  }
}
