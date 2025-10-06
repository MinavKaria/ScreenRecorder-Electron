// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  minimize: () => ipcRenderer.invoke("window-minimize"),
  close: () => ipcRenderer.invoke("window-close"),
  getSources: () => ipcRenderer.invoke("get-sources"),
  getAudioSources: () => ipcRenderer.invoke("get-audio-sources"),
  chooseFolder: () => ipcRenderer.invoke("choose-folder"),
  saveRecording: (buffer: ArrayBuffer, fileName: string, folderPath: string) => 
    ipcRenderer.invoke("save-recording", buffer, fileName, folderPath),
});