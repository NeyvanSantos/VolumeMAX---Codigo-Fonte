import { useState, useEffect } from 'react';
import { ArrowLeft, Zap, Keyboard, ArrowUp, ArrowDown, SlidersHorizontal, Cpu, Download, CheckCircle2 } from 'lucide-react';
import type { EngineStatus } from '../types/audio';

interface SettingsPanelProps {
  open: boolean;
  onClose: () => void;
  autoStart: boolean;
  onAutoStartChange: (value: boolean) => void;
  minimizeToTray: boolean;
  onMinimizeToTrayChange: (value: boolean) => void;
  engineStatus?: EngineStatus;
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div
      className={`toggle ${value ? 'toggle--on' : ''}`}
      onClick={() => onChange(!value)}
    >
      <div className="toggle__thumb" />
    </div>
  );
}

function SettingsPanel({
  open,
  onClose,
  autoStart,
  onAutoStartChange,
  minimizeToTray,
  onMinimizeToTrayChange,
  engineStatus,
}: SettingsPanelProps) {
  const [installing, setInstalling] = useState(false);

  // Fecha o painel ao pressionar Escape
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  const handleInstallApo = async () => {
    setInstalling(true);
    try {
      await window.volumemax?.installApo?.();
    } catch (e) {
      console.error(e);
    } finally {
      setTimeout(() => setInstalling(false), 2000);
    }
  };

  const isApoInstalled = engineStatus?.installed ?? false;

  return (
    <div className={`settings-panel ${open ? 'settings-panel--open' : ''}`}>
      <div className="settings-panel__header">
        <button
          type="button"
          className="settings-panel__back"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          title="Voltar"
          style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
        >
          <ArrowLeft size={16} style={{ pointerEvents: 'none' }} />
        </button>
        <span className="settings-panel__title">Configurações</span>
      </div>
      <div className="settings-panel__content">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 'var(--space-md)' }}>
            <SlidersHorizontal size={12} />
            <span>Geral</span>
          </div>
          <div className="setting-row">
            <div>
              <div className="setting-row__label">Iniciar com o Windows</div>
              <div className="setting-row__description">Abrir automaticamente na inicialização</div>
            </div>
            <Toggle value={autoStart} onChange={onAutoStartChange} />
          </div>
          <div className="setting-row">
            <div>
              <div className="setting-row__label">Minimizar para bandeja</div>
              <div className="setting-row__description">Ao fechar, mantém na bandeja do sistema</div>
            </div>
            <Toggle value={minimizeToTray} onChange={onMinimizeToTrayChange} />
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 'var(--space-md)' }}>
            <Cpu size={12} />
            <span>Motor de Amplificação</span>
          </div>

          <div className="setting-row" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
              <div>
                <div className="setting-row__label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Zap size={13} style={{ color: 'var(--color-primary)' }} />
                  Equalizer APO
                </div>
                <div className="setting-row__description">
                  Processamento de áudio em tempo real integrado ao driver do Windows
                </div>
              </div>
              <span
                style={{
                  fontSize: 'var(--text-xs)',
                  fontWeight: 600,
                  padding: '2px 8px',
                  borderRadius: '4px',
                  background: isApoInstalled ? 'rgba(34, 197, 94, 0.2)' : 'rgba(234, 179, 8, 0.2)',
                  color: isApoInstalled ? 'var(--color-success)' : '#eab308',
                  whiteSpace: 'nowrap',
                }}
              >
                {isApoInstalled ? '● Integrado & Ativo' : '● Não detectado'}
              </span>
            </div>

            {isApoInstalled ? (
              <div style={{ width: '100%', padding: '8px 10px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px', fontSize: '11px', color: 'var(--text-secondary)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span>Ganho do Driver (Preamp):</span>
                  <strong style={{ color: 'var(--color-primary)' }}>
                    {parseFloat(engineStatus?.gainDb || '0') > 0 ? `+${engineStatus?.gainDb} dB` : '0.0 dB'}
                  </strong>
                </div>
                <div style={{ color: 'var(--text-tertiary)', fontSize: '10px' }}>
                  Configuração ativa em C:\Program Files\EqualizerAPO\config\config.txt
                </div>
              </div>
            ) : (
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', lineHeight: '1.5' }}>
                  Para amplificar acima de 100%, é necessário o Equalizer APO instalado no sistema.
                </div>
                <button
                  type="button"
                  onClick={handleInstallApo}
                  disabled={installing}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    background: 'var(--color-primary)',
                    color: '#fff',
                    border: 'none',
                    fontSize: 'var(--text-xs)',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  <Download size={13} />
                  {installing ? 'Abrindo instalador...' : 'Instalar Equalizer APO (Recomendado)'}
                </button>
              </div>
            )}
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 'var(--space-md)' }}>
            <Keyboard size={12} />
            <span>Atalhos Globais de Volume</span>
          </div>
          <div className="setting-row">
            <div className="setting-row__label">Aumentar Boost (+10%)</div>
            <span className="hotkey-hint__key">
              Ctrl + Shift + <ArrowUp size={11} className="hotkey-hint__arrow" />
            </span>
          </div>
          <div className="setting-row">
            <div className="setting-row__label">Diminuir Boost (-10%)</div>
            <span className="hotkey-hint__key">
              Ctrl + Shift + <ArrowDown size={11} className="hotkey-hint__arrow" />
            </span>
          </div>
        </div>

        <div style={{ marginTop: 'auto', paddingTop: 'var(--space-lg)', borderTop: 'var(--border-subtle)' }}>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', textAlign: 'center' }}>
            VolumeMax v2.0.0
          </div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', textAlign: 'center', marginTop: '4px' }}>
            Motor Equalizer APO Integrado — Zero FxSound
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsPanel;
