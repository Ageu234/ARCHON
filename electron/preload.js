const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Window controls
  minimize: () => ipcRenderer.invoke('window:minimize'),
  maximize: () => ipcRenderer.invoke('window:maximize'),
  close: () => ipcRenderer.invoke('window:close'),
  isMaximized: () => ipcRenderer.invoke('window:isMaximized'),

  // File dialogs
  saveProject: (data) => ipcRenderer.invoke('dialog:save', data),
  openProject: () => ipcRenderer.invoke('dialog:open'),

  // Menu events
  onNewProject: (callback) => ipcRenderer.on('menu:new-project', callback),
  onSaveProject: (callback) => ipcRenderer.on('menu:save-project', callback),
  onSaveProjectAs: (callback) => ipcRenderer.on('menu:save-project-as', callback),
  onExportSTL: (callback) => ipcRenderer.on('menu:export-stl', callback),
  onProjectLoaded: (callback) => ipcRenderer.on('project:loaded', (e, data) => callback(data)),
});
