import { BrowserWindow, ipcMain } from "electron";
import {
  Pipeline,
  pipeline,
  PipelineType,
  TextGenerationOutput,
  TextGenerationPipeline,
} from "@huggingface/transformers";
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
    ipcMain.handle("run-model", () => this.generateText());
    ipcMain.handle("get-model-data", () => this.fetchModelDataList());
    ipcMain.handle("download-model", (_evt, modelId) => {
      this.downloadModel(modelId);
    });
  }

  private progressCallback(progress: ProgressStatusInfo) {
    // progress status: initiate -> download -> progress -> done
    this.mainWindow.webContents.send("download-progress", {
      progress,
    });
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
        isDownloading: false,
      });
    } catch (error) {
      notify.show({
        title: "Model download Failed!",
        body: `${modelId} model download failed.\nError: ${error}`,
      });
      console.error(`Error downloading model:\n${error}`);
      this.mainWindow.webContents.send("download-status", {
        isDownloading: false,
      });
    }
  }

  private async generateText(): Promise<
    TextGenerationOutput | TextGenerationOutput[]
  > {
    try {
      const generator = await pipeline(
        "text-generation",
        "HuggingFaceTB/SmolLM2-135M-Instruct"
      );
      const text = "System: You are a helpful assistant.\nUser: Write JS code to calculate BMI\nAssistant: ";
      const output = await generator(text, {
        temperature: 2,
        max_new_tokens: 1000,
        repetition_penalty: 1.5,
        no_repeat_ngram_size: 2,
        num_beams: 2,
        num_return_sequences: 2,
      });

      return output;
    } catch (error) {
      console.error("Error running model:", error);
      return error.message;
    }
  }
}
