export interface AudioSession {
  pid: number;
  name: string;
  icon: string;
  volume: number; // 0-500
  muted: boolean;
}

export interface AudioProfile {
  id: string;
  name: string;
  icon: string;
  boostLevel: number;
  limiterEnabled: boolean;
  limiterThreshold: number;
  perAppVolumes: Record<string, number>;
}

export interface AudioLevels {
  left: number;  // 0-1
  right: number; // 0-1
  peakLeft: number;
  peakRight: number;
  clipping: boolean;
}

export interface EngineStatus {
  installed: boolean;
  path: string;
  gainDb: string;
  boostLevel: number;
  engine: 'equalizer-apo';
}

export interface UpdateInfo {
  version: string;
  downloadUrl: string;
  fileName: string;
  releaseNotes: string;
}

export interface VolumeMaxAPI {
  getBoostLevel: () => Promise<number>;
  setBoostLevel: (level: number) => Promise<number>;
  setMute?: (mute: boolean) => Promise<boolean>;
  getEngineStatus?: () => Promise<EngineStatus>;
  installApo?: () => Promise<{ success: boolean; message: string }>;
  getAudioSessions: () => Promise<AudioSession[]>;
  setAppVolume: (pid: number, volume: number) => Promise<boolean>;
  setLimiter: (enabled: boolean, threshold?: number) => Promise<boolean>;
  getAutoStart?: () => Promise<boolean>;
  setAutoStart?: (enable: boolean) => Promise<boolean>;
  minimizeToTray: () => void;
  closeWindow: () => void;
  minimizeWindow: () => void;
  onBoostChanged: (callback: (level: number) => void) => () => void;
  onAudioMeter?: (callback: (data: { left: number; right: number; master: number; clipping: boolean }) => void) => () => void;
  checkForUpdates?: () => Promise<UpdateInfo | null>;
  downloadAndInstallUpdate?: (updateInfo: UpdateInfo) => Promise<{ success: boolean; error?: string }>;
  onUpdateAvailable?: (callback: (info: UpdateInfo) => void) => () => void;
  onUpdateDownloadProgress?: (callback: (percent: number) => void) => () => void;
}

declare global {
  interface Window {
    volumemax?: VolumeMaxAPI;
  }
}
