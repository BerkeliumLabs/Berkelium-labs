import { BerkeliumFileManager } from '../utils/file-manager';
import path from 'node:path';
import { app, BrowserWindow, ipcMain } from 'electron';
import { existsSync, mkdirSync } from 'node:fs';
import { BerkeliumModelManager } from './model-manager';

export class BerkeliumIPCHandlers {
  private mainWindow: BrowserWindow;
  private fileManager: BerkeliumFileManager;
  private modelManager: BerkeliumModelManager;
  APP_SETTINGS_DIR = path.join(app.getPath('appData'), 'Berkeliumlabs Studio');

  constructor(appWindow: BrowserWindow) {
    this.mainWindow = appWindow;
    this.fileManager = new BerkeliumFileManager(this.APP_SETTINGS_DIR);
    this.modelManager = new BerkeliumModelManager(this.mainWindow);
  }

  init() {
    this.createCacheDir();

    ipcMain.handle('read-app-settings', async () =>
      this.fileManager.readAppSettings()
    );
    ipcMain.handle('write-app-settings', async (_, settings: BkAppSettings) =>
      this.fileManager.writeAppSettings(settings)
    );
    ipcMain.handle('chose-cahce-dir', async () =>
      this.fileManager.selectFolder()
    );
    ipcMain.handle('get-model-data', () => this.modelManager.fetchModelDataList());
    ipcMain.handle('download-model', (_evt, modelId) => {
      this.modelManager.downloadModel(modelId);
    });
  }

  private createCacheDir() {
    this.fileManager.readAppSettings().then((settings) => {
      const cacheDir = 'Berkeliumlabs Studio/Cache';
      let customSessionDataDir = path.join(app.getPath('documents'), cacheDir);
      if (settings && settings.cacheDir) {
        const cacheDirPath = settings.cacheDir;
        if (!existsSync(cacheDirPath)) {
          mkdirSync(cacheDirPath, { recursive: true });
        }
        customSessionDataDir = path.join(cacheDirPath, cacheDir);
      }

      // Define the custom session data directory
      app.setPath('sessionData', customSessionDataDir);
    });
  }
}
