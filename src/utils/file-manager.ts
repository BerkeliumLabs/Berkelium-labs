import { dialog, OpenDialogReturnValue } from 'electron';
import { readFileSync, writeFileSync } from 'node:fs';

export class BerkeliumFileManager {
  appSettingsDir: string;

  constructor(settingsDir: string) {
    this.appSettingsDir = settingsDir;
  }

  async readAppSettings(): Promise<BkAppSettings | null> {
    try {
      const settingsFilePath = `${this.appSettingsDir}/berkeliumlabs_settings.json`;
      const settings = await readFileSync(settingsFilePath, 'utf-8');
      return JSON.parse(settings);
    } catch (error) {
      console.error('Error reading app settings:', error);
      return null;
    }
  }

  async writeAppSettings(settings: BkAppSettings): Promise<void> {
    try {
      const settingsFilePath = `${this.appSettingsDir}/berkeliumlabs_settings.json`;
      await writeFileSync(settingsFilePath, JSON.stringify(settings));
    } catch (error) {
      console.error('Error writing app settings:', error);
    }
  }
  
  async selectFolder(): Promise<OpenDialogReturnValue | null> {
    try {
      const result = await dialog.showOpenDialog({
        properties: ['openDirectory'],
      });
      return result;
    } catch (error) {
      console.error('Error chosing folder.', error);
      return null;
    }
  }
}
