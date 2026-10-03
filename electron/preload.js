const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('volumemax', {
  // Volume control
  getBoostLevel: () => ipcRenderer.invoke('get-boost-level'),
  setBoostLevel: (level) => ipcRenderer.invoke('set-boost-level', level),
  setMute: (mute) => ipcRenderer.invoke('set-mute', mute),

  // Audio Engine Status & Installation
  getEngineStatus: () => ipcRenderer.invoke('get-engine-status'),
  installApo: () => ipcRenderer.invoke('install-apo'),

  // Audio Sessions (per-app)
  getAudioSessions: () => ipcRenderer.invoke('get-audio-sessions'),
  setAppVolume: (pid, volume) => ipcRenderer.invoke('set-app-volume', pid, volume),

  // Limiter
  setLimiter: (enabled, threshold) => ipcRenderer.invoke('set-limiter', enabled, threshold),

  // AutoStart
  getAutoStart: () => ipcRenderer.invoke('get-autostart'),
  setAutoStart: (enable) => ipcRenderer.invoke('set-autostart', enable),

  // Window controls
  minimizeWindow: () => ipcRenderer.send('minimize-window'),
  minimizeToTray: () => ipcRenderer.send('minimize-to-tray'),
  closeWindow: () => ipcRenderer.send('close-window'),

  // Events from main process
  onBoostChanged: (callback) => {
    const handler = (_, level) => callback(level);
    ipcRenderer.on('boost-changed', handler);
    return () => ipcRenderer.removeListener('boost-changed', handler);
  },
  onAudioMeter: (callback) => {
    const handler = (_, data) => callback(data);
    ipcRenderer.on('audio-meter', handler);
    return () => ipcRenderer.removeListener('audio-meter', handler);
  },

  // Auto-Update
  checkForUpdates: () => ipcRenderer.invoke('check-for-updates'),
  downloadAndInstallUpdate: (updateInfo) => ipcRenderer.invoke('download-and-install-update', updateInfo),
  onUpdateAvailable: (callback) => {
    const handler = (_, info) => callback(info);
    ipcRenderer.on('update-available', handler);
    return () => ipcRenderer.removeListener('update-available', handler);
  },
  onUpdateDownloadProgress: (callback) => {
    const handler = (_, percent) => callback(percent);
    ipcRenderer.on('update-download-progress', handler);
    return () => ipcRenderer.removeListener('update-download-progress', handler);
  },
});
