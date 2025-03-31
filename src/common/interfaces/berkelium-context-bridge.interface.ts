import { ProgressStatusInfo } from "@huggingface/transformers/types/utils/core";
import { IHuggingfaceModelData } from "./huggingface-model-data.interface";
import { TextGenerationOutput } from "@huggingface/transformers/types/pipelines";

export interface BerkeliumContextBridge {
  getModelData(): Promise<IHuggingfaceModelData[]> | null;
  downloadModel(modelId: string): Promise<void>;
  onDownloadProgress: (
    callback: (
      event: Electron.IpcRendererEvent,
      progress: ProgressStatusInfo
    ) => void
  ) => void;
  onDownloadEnd: (callback: () => void) => void;
  generateText(): Promise<TextGenerationOutput | TextGenerationOutput[]>;
}
