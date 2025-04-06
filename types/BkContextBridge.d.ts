interface BkContextBridge {
  readAppSettings(): Promise<BkAppSettings | null>;
  writeAppSettings(settings: BkAppSettings): Promise<void>;
  setCacheDir(): Promise<Electron.OpenDialogReturnValue | null>;
}
