import { useRef, useCallback, useEffect, useState } from 'react';
import { VolumeX } from 'lucide-react';
import { AppIcon } from './AppIcon';
import type { AudioSession } from '../types/audio';

interface AppVolumeListProps {
  sessions: AudioSession[];
  onVolumeChange: (pid: number, volume: number) => void;
}

function AppVolumeItem({ session, onVolumeChange }: { session: AudioSession; onVolumeChange: (pid: number, vol: number) => void }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);

  const getValueFromPosition = useCallback((clientX: number) => {
    if (!trackRef.current) return session.volume;
    const rect = trackRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, x / rect.width));
    return Math.round(ratio * 100);
  }, [session.volume]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setDragging(true);
    onVolumeChange(session.pid, getValueFromPosition(e.clientX));
  }, [getValueFromPosition, onVolumeChange, session.pid]);

  useEffect(() => {
    if (!dragging) return;
    const handleMouseMove = (e: MouseEvent) => {
      onVolumeChange(session.pid, getValueFromPosition(e.clientX));
    };
    const handleMouseUp = () => setDragging(false);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging, getValueFromPosition, onVolumeChange, session.pid]);

  const fillPercent = Math.min(100, Math.max(0, session.volume));

  return (
    <div className="app-item">
      <div className="app-item__icon">
        <AppIcon name={session.name} icon={session.icon} size={20} />
      </div>
      <div className="app-item__name">{session.name}</div>
      <div className="app-item__slider" ref={trackRef} onMouseDown={handleMouseDown}>
        <div className="app-item__slider-bg" />
        <div className="app-item__slider-fill" style={{ width: `${fillPercent}%` }} />
        <div className="app-item__slider-thumb" style={{ left: `${fillPercent}%` }} />
      </div>
      <div className="app-item__value">{session.volume}%</div>
    </div>
  );
}

function AppVolumeList({ sessions, onVolumeChange }: AppVolumeListProps) {
  return (
    <div className="app-list animate-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-sm)' }}>
        <div className="app-list__title" style={{ marginBottom: 0 }}>Volume por Aplicativo</div>
        <span style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>
          {sessions.length} {sessions.length === 1 ? 'ativo' : 'ativos'}
        </span>
      </div>
      {sessions.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-tertiary)', textAlign: 'center', padding: '16px 0', border: 'var(--border-subtle)', borderRadius: 'var(--radius-sm)' }}>
          <VolumeX size={18} style={{ opacity: 0.4 }} />
          <span>Nenhum aplicativo com áudio ativo no momento</span>
        </div>
      ) : (
        sessions.map(session => (
          <AppVolumeItem
            key={session.pid}
            session={session}
            onVolumeChange={onVolumeChange}
          />
        ))
      )}
    </div>
  );
}

export default AppVolumeList;
