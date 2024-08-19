const { contextBridge, ipcRenderer, shell } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args)
  },
  shell
})