import { BerkeliumFileManager } from './utils/file-manager';
import path from 'node:path';
import { app, ipcMain } from 'electron';
import { existsSync, mkdirSync } from 'node:fs';

const APP_SETTINGS_DIR = path.join(
  app.getPath('appData'),
  'Berkeliumlabs Studio'
);
const fileManager = new BerkeliumFileManager(APP_SETTINGS_DIR);

ipcMain.handle('read-app-settings', async () => fileManager.readAppSettings());
ipcMain.handle('write-app-settings', async (_, settings: BkAppSettings) =>
  fileManager.writeAppSettings(settings)
);

function createCacheDir() {
  fileManager.readAppSettings().then((settings) => {
    const cacheDir = 'Berkeliumlabs Studio/Cache';
    let customSessionDataDir = path.join(
      app.getPath('documents'),
      cacheDir
    );
    if (settings) {
      const cacheDirPath = settings.cacheDir;
      if (!existsSync(cacheDirPath)) {
        mkdirSync(cacheDirPath, { recursive: true });
      }
      customSessionDataDir = path.join(
        cacheDirPath,
        cacheDir
      );
    }

    // Define the custom session data directory
    app.setPath('sessionData', customSessionDataDir);
  });
}

createCacheDir();
