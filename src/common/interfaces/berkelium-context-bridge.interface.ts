import { IHuggingfaceModelData } from "./huggingface-model-data.interface";

export interface BerkeliumContextBridge {
  getModelData(): Promise<IHuggingfaceModelData[]> | null;
}
