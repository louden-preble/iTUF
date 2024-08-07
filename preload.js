const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    processFiles: (filePaths) => ipcRenderer.invoke('process-files', filePaths)
});
