interface BkAppSettings {
  version?: string;
  cacheDir?: string;
  models?: string[];
  modelData?: BkHuggingfaceModelData[];
  modelFiles?: { [key: string]: { progressBars: string[]; progressData: any } };
}
