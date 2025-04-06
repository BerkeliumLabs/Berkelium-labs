interface BkContextBridge {
  readAppSettings(): Promise<BkAppSettings | null>;
  writeAppSettings(settings: BkAppSettings): Promise<void>;
  setCacheDir(): Promise<Electron.OpenDialogReturnValue | null>;
  getModelList(): Promise<BkHuggingfaceModelData[] | null>;
  downloadModel(): Promise<void>;
}
