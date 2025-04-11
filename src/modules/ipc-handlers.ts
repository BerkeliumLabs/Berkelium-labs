import { BerkeliumFileManager } from '../utils/file-manager';
import path from 'node:path';
import { app, ipcMain, NotificationConstructorOptions } from 'electron';
import { existsSync, mkdirSync } from 'node:fs';
import { BerkeliumNotifications } from '../utils/notifications';
export class BerkeliumIPCHandlers {
  private fileManager: BerkeliumFileManager;
  APP_SETTINGS_DIR = path.join(app.getPath('appData'), 'Berkelium Labs');

  constructor() {
    this.fileManager = new BerkeliumFileManager(this.APP_SETTINGS_DIR);
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
    ipcMain.handle('show-notification', (_, options: NotificationConstructorOptions) =>
      this.sendNotification(options)
    );
  }

  private createCacheDir() {
    this.fileManager.readAppSettings().then((settings) => {
      const cacheDir = 'Berkelium Labs/Cache';
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

  private sendNotification(options: NotificationConstructorOptions): void {
    const notify = new BerkeliumNotifications()
    notify.show(options);
  }
}
