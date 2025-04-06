// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";

/* Context Bridge */
contextBridge.exposeInMainWorld("berkelium", {
    readAppSettings: () => ipcRenderer.invoke('read-app-settings'),
    writeAppSettings: (settings: BkAppSettings) => ipcRenderer.invoke('write-app-settings', settings),
    setCacheDir: () => ipcRenderer.invoke('chose-cahce-dir')
});
