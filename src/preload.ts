// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from "electron";
import { BerkeliumContextBridge } from "./common/interfaces/berkelium-context-bridge.interface";
import { ProgressStatusInfo } from "@huggingface/transformers/types/utils/core";

/* Context Bridge */
contextBridge.exposeInMainWorld("berkelium", {
  getModelData: () => ipcRenderer.invoke("get-model-data"),
  downloadModel: (modelId: string) =>
    ipcRenderer.invoke("download-model", modelId),
  onDownloadProgress: (
    callback: (
      event: Electron.IpcRendererEvent,
      progress: ProgressStatusInfo
    ) => void
  ) => ipcRenderer.on("download-progress", callback),
  onDownloadEnd: (callback: () => void) =>
    ipcRenderer.on("download-status", callback),
  generateText: () => ipcRenderer.invoke('run-model')
});

/* Extend Global Variables */
declare global {
  interface Window {
    berkelium: BerkeliumContextBridge;
  }
}
