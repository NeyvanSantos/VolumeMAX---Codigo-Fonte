import { useState, useCallback, useEffect } from 'react';
import TitleBar from './components/TitleBar';
import MasterSlider from './components/MasterSlider';
import LevelMeter from './components/LevelMeter';
import QuickActions from './components/QuickActions';
import AppVolumeList from './components/AppVolumeList';
import HotkeyHint from './components/HotkeyHint';
import SettingsPanel from './components/SettingsPanel';
import type { AudioSession, AudioLevels, AudioProfile, EngineStatus } from './types/audio';

const INITIAL_PROFILES: AudioProfile[] = [
  { id: 'music', name: 'Música', icon: 'music', boostLevel: 250, limiterEnabled: true, limiterThreshold: -3, perAppVolumes: {} },
  { id: 'movie', name: 'Filme', icon: 'movie', boostLevel: 350, limiterEnabled: true, limiterThreshold: -1, perAppVolumes: {} },
  { id: 'meeting', name: 'Reunião', icon: 'meeting', boostLevel: 200, limiterEnabled: true, limiterThreshold: -6, perAppVolumes: {} },
  { id: 'gaming', name: 'Gaming', icon: 'gaming', boostLevel: 400, limiterEnabled: false, limiterThreshold: 0, perAppVolumes: {} },
];

function loadSavedProfiles(): AudioProfile[] {
  try {
    const raw = localStorage.getItem('volumemax_profiles');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch { }
  return INITIAL_PROFILES;
}

function App() {
  const [boostLevel, setBoostLevel] = useState(100);
  const [limiterEnabled, setLimiterEnabled] = useState(true);
  const [muteEnabled, setMuteEnabled] = useState(false);
  const [activeProfileId, setActiveProfileId] = useState('music');
  const [profiles, setProfiles] = useState<AudioProfile[]>(loadSavedProfiles);
  const [sessions, setSessions] = useState<AudioSession[]>([]);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [autoStart, setAutoStart] = useState(false);
  const [minimizeToTray, setMinimizeToTray] = useState(true);
  const [engineStatus, setEngineStatus] = useState<EngineStatus | undefined>(undefined);
  const [audioLevels, setAudioLevels] = useState<AudioLevels>({
    left: 0, right: 0, peakLeft: 0, peakRight: 0, clipping: false
  });

  const refreshStatus = useCallback(() => {
    if (window.volumemax) {
      window.volumemax.getEngineStatus?.().then((status) => {
        setEngineStatus(status);
      });
    }
  }, []);

  const refreshSessions = useCallback(() => {
    if (window.volumemax) {
      window.volumemax.getAudioSessions?.().then((retrievedSessions) => {
        if (Array.isArray(retrievedSessions)) {
          setSessions(retrievedSessions);
        }
      });
    }
  }, []);

  // Sync with Electron backend & real Windows audio
  useEffect(() => {
    if (window.volumemax) {
      window.volumemax.getBoostLevel?.().then((level) => {
        if (typeof level === 'number') setBoostLevel(level);
      });

      refreshStatus();
      refreshSessions();

      window.volumemax.getAutoStart?.().then((enabled) => {
        if (typeof enabled === 'boolean') setAutoStart(enabled);
      });

      const cleanupBoost = window.volumemax.onBoostChanged?.((level) => {
        setBoostLevel(level);
      });

      // Real Audio Meter subscription from Windows Core Audio endpoint
      const cleanupMeter = window.volumemax.onAudioMeter?.((data) => {
        setAudioLevels({
          left: data.left,
          right: data.right,
          peakLeft: data.left,
          peakRight: data.right,
          clipping: data.clipping,
        });
      });

      // Polling dynamic running applications every 4 seconds
      const sessionInterval = setInterval(refreshSessions, 4000);

      // Polling engine status every 5 seconds
      const statusInterval = setInterval(refreshStatus, 5000);

      return () => {
        if (typeof cleanupBoost === 'function') cleanupBoost();
        if (typeof cleanupMeter === 'function') cleanupMeter();
        clearInterval(sessionInterval);
        clearInterval(statusInterval);
      };
    }
  }, [refreshStatus, refreshSessions]);

  const handleBoostChange = useCallback((value: number) => {
    setBoostLevel(value);
    window.volumemax?.setBoostLevel?.(value);
  }, []);

  const handleAppVolumeChange = useCallback((pid: number, volume: number) => {
    setSessions(prev => prev.map(s => s.pid === pid ? { ...s, volume } : s));
    window.volumemax?.setAppVolume?.(pid, volume);
  }, []);

  const handleProfileChange = useCallback((id: string) => {
    setActiveProfileId(id);
    const profile = profiles.find(p => p.id === id);
    if (profile) {
      setBoostLevel(profile.boostLevel);
      setLimiterEnabled(profile.limiterEnabled);
      window.volumemax?.setBoostLevel?.(profile.boostLevel);
      window.volumemax?.setLimiter?.(profile.limiterEnabled, profile.limiterThreshold);
    }
  }, [profiles]);

  const handleToggleLimiter = useCallback(() => {
    setLimiterEnabled(prev => {
      const next = !prev;
      window.volumemax?.setLimiter?.(next);
      return next;
    });
  }, []);

  const handleToggleMute = useCallback(() => {
    setMuteEnabled(prev => {
      const next = !prev;
      window.volumemax?.setMute?.(next);
      return next;
    });
  }, []);

  const handleAutoStartChange = useCallback((enabled: boolean) => {
    setAutoStart(enabled);
    window.volumemax?.setAutoStart?.(enabled);
  }, []);

  // Persist customized profiles to localStorage
  const handleSaveProfile = useCallback((updatedProfile: AudioProfile) => {
    setProfiles(prev => {
      const next = prev.map(p => p.id === updatedProfile.id ? updatedProfile : p);
      try {
        localStorage.setItem('volumemax_profiles', JSON.stringify(next));
      } catch { }
      return next;
    });
  }, []);

  // Global browser keyboard shortcuts fallback
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'ArrowUp') {
        e.preventDefault();
        setBoostLevel(prev => {
          const next = Math.min(500, prev + 10);
          window.volumemax?.setBoostLevel?.(next);
          return next;
        });
      }
      if (e.ctrlKey && e.shiftKey && e.key === 'ArrowDown') {
        e.preventDefault();
        setBoostLevel(prev => {
          const next = Math.max(0, prev - 10);
          window.volumemax?.setBoostLevel?.(next);
          return next;
        });
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const activeProfile = profiles.find(p => p.id === activeProfileId) || profiles[0];

  return (
    <div className="app">
      <TitleBar onSettings={() => setSettingsOpen(true)} />
      <div className="app__content">

        {engineStatus && !engineStatus.installed && boostLevel > 100 && (
          <div
            style={{
              padding: '6px 10px',
              margin: '0 12px 8px',
              borderRadius: '6px',
              background: 'rgba(234, 179, 8, 0.15)',
              border: '1px solid rgba(234, 179, 8, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '8px',
              fontSize: '11px',
            }}
          >
            <span style={{ color: '#fef08a' }}>Equalizer APO necessário para boost &gt; 100%</span>
            <button
              type="button"
              onClick={() => window.volumemax?.installApo?.()}
              style={{
                padding: '3px 8px',
                borderRadius: '4px',
                background: '#eab308',
                color: '#000',
                fontWeight: 600,
                fontSize: '10px',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Instalar
            </button>
          </div>
        )}

        <div className="master-section animate-in">
          <MasterSlider
            value={boostLevel}
            onChange={handleBoostChange}
            muted={muteEnabled}
          />
          <LevelMeter levels={audioLevels} />
        </div>

        <QuickActions
          profile={activeProfile}
          profiles={profiles}
          limiterEnabled={limiterEnabled}
          muteEnabled={muteEnabled}
          onProfileChange={handleProfileChange}
          onToggleLimiter={handleToggleLimiter}
          onToggleMute={handleToggleMute}
          onSettings={() => setSettingsOpen(true)}
        />

        <AppVolumeList
          sessions={sessions}
          onVolumeChange={handleAppVolumeChange}
        />

        <HotkeyHint />
      </div>

      <SettingsPanel
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        autoStart={autoStart}
        onAutoStartChange={handleAutoStartChange}
        minimizeToTray={minimizeToTray}
        onMinimizeToTrayChange={setMinimizeToTray}
        engineStatus={engineStatus}
      />
    </div>
  );
}

export default App;
