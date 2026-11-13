const {contextBridge, ipcRenderer} = require('electron');
contextBridge.exposeInMainWorld('electronAPI', {
    onAccessToken: (callback) => ipcRenderer.on('access-token', (event, token) => callback(token))
});