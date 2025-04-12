import {
  updateElectronApp,
  UpdateSourceType,
  makeUserNotifier
} from 'update-electron-app';

export class BkAutoUpdater {
  constructor() {
    updateElectronApp({
      updateSource: {
        type: UpdateSourceType.ElectronPublicUpdateService,
        repo: 'BerkeliumLabs/Berkeliumlabs-studio',
      },
      updateInterval: '1 hour',
      /* logger: require('electron-log'), */
      notifyUser: true,
    });

    makeUserNotifier({
      title: 'New Update Available',
    });
  }
}
