// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from "electron";
import { BerkeliumContextBridge } from "./common/interfaces/berkelium-context-bridge.interface";

/* Context Bridge */
contextBridge.exposeInMainWorld("berkelium", {
  run: () => ipcRenderer.invoke("run-model"),
  getModelData: () => ipcRenderer.invoke('get-model-data')
});

/* Extend Global Variables */
declare global {
  interface Window { berkelium: BerkeliumContextBridge; }
}