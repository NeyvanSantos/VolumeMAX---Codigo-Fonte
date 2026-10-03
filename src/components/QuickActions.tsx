import { useState } from 'react';
import { Shield, ShieldCheck, Volume2, VolumeX, Settings, ChevronDown } from 'lucide-react';
import { ProfileIcon } from './ProfileIcon';
import type { AudioProfile } from '../types/audio';

interface QuickActionsProps {
  profile: AudioProfile;
  profiles: AudioProfile[];
  limiterEnabled: boolean;
  muteEnabled: boolean;
  onProfileChange: (id: string) => void;
  onToggleLimiter: () => void;
  onToggleMute: () => void;
  onSettings: () => void;
}

function QuickActions({
  profile,
  profiles,
  limiterEnabled,
  muteEnabled,
  onProfileChange,
  onToggleLimiter,
  onToggleMute,
  onSettings,
}: QuickActionsProps) {
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <div className="quick-actions animate-in" style={{ position: 'relative' }}>
      {/* Profile */}
      <div className="profile-selector">
        <button
          className={`quick-action ${profileOpen ? 'quick-action--active' : ''}`}
          onClick={() => setProfileOpen(prev => !prev)}
          title="Selecionar Perfil de Áudio"
        >
          <span className="quick-action__icon">
            <ProfileIcon icon={profile.icon} size={16} />
          </span>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
            <span className="quick-action__label">{profile.name}</span>
            <ChevronDown size={10} style={{ opacity: 0.7 }} />
          </div>
        </button>
        <div className={`profile-selector__dropdown ${profileOpen ? 'profile-selector__dropdown--open' : ''}`}>
          {profiles.map(p => (
            <div
              key={p.id}
              className={`profile-selector__option ${p.id === profile.id ? 'profile-selector__option--active' : ''}`}
              onClick={() => { onProfileChange(p.id); setProfileOpen(false); }}
            >
              <ProfileIcon icon={p.icon} size={15} />
              <span>{p.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Limiter */}
      <button
        className={`quick-action ${limiterEnabled ? 'quick-action--active' : ''}`}
        onClick={onToggleLimiter}
        title={limiterEnabled ? 'Anti-Distorção Ativado' : 'Anti-Distorção Desativado'}
      >
        <span className="quick-action__icon">
          {limiterEnabled ? <ShieldCheck size={16} /> : <Shield size={16} />}
        </span>
        <span className="quick-action__label">{limiterEnabled ? 'ON' : 'OFF'}</span>
      </button>

      {/* Mute */}
      <button
        className={`quick-action ${muteEnabled ? 'quick-action--active' : ''}`}
        onClick={onToggleMute}
        title={muteEnabled ? 'Desmutar' : 'Mutar Áudio'}
      >
        <span className="quick-action__icon">
          {muteEnabled ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </span>
        <span className="quick-action__label">{muteEnabled ? 'Mudo' : 'Som'}</span>
      </button>

      {/* Settings */}
      <button className="quick-action" onClick={onSettings} title="Configurações">
        <span className="quick-action__icon">
          <Settings size={16} />
        </span>
        <span className="quick-action__label">Config</span>
      </button>
    </div>
  );
}

export default QuickActions;
