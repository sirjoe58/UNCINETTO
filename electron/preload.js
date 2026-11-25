const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('sirjoeNative', {
  leggiLocale: () => ipcRenderer.invoke('leggiLocale'),
  scriviLocale: t => ipcRenderer.invoke('scriviLocale', t),
  getCartellaNAS: () => ipcRenderer.invoke('getCartellaNAS'),
  impostaCartellaNAS: c => ipcRenderer.invoke('impostaCartellaNAS', c),
  scegliCartellaNAS: () => ipcRenderer.invoke('scegliCartellaNAS'),
  leggiNAS: n => ipcRenderer.invoke('leggiNAS', n),
  scriviNAS: (n, t) => ipcRenderer.invoke('scriviNAS', n, t),
  salvaFile: (n, t) => ipcRenderer.invoke('salvaFile', n, t),
});
