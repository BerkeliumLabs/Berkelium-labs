// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from "electron";

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld("berkelium", {
  // Model Management
  getCompatibleModels: () => ipcRenderer.invoke("get-compatible-models"),
  getDownloadedModels: () => ipcRenderer.invoke("get-downloaded-models"),
  downloadModel: (modelInfo: any) =>
    ipcRenderer.invoke("download-model", modelInfo),
  deleteModel: (modelId: string) => ipcRenderer.invoke("delete-model", modelId),

  // Text Generation
  generateResponse: (params: any) =>
    ipcRenderer.invoke("generate-response", params),

  // Events
  onDownloadProgress: (callback: Function) =>
    ipcRenderer.on("download-progress", (event, data) => callback(data)),

  removeDownloadProgressListener: () =>
    ipcRenderer.removeAllListeners("download-progress"),
});

/* Extend Global Variables */
declare global {
  interface Window {
    berkelium: any;
    modelManager: any;
    chatManager: any;
  }
}
