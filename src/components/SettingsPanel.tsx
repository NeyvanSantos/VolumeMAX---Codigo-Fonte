import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Zap,
  Keyboard,
  ArrowUp,
  ArrowDown,
  SlidersHorizontal,
  Cpu,
  Download,
  RefreshCw,
  FileText,
  Info,
  ChevronRight,
  ShieldCheck,
  X,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';
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
  const [checkingUpdate, setCheckingUpdate] = useState(false);
  const [updateStatus, setUpdateStatus] = useState<{
    status: 'idle' | 'checking' | 'latest' | 'available' | 'error';
    message: string;
  }>({
    status: 'idle',
    message: 'Versão instalada: v2.0.0',
  });

  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);

  // Fecha o painel ou modais ao pressionar Escape
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showTermsModal) {
          setShowTermsModal(false);
        } else if (showAboutModal) {
          setShowAboutModal(false);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose, showTermsModal, showAboutModal]);

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

  const handleCheckUpdates = async () => {
    setCheckingUpdate(true);
    setUpdateStatus({ status: 'checking', message: 'Consultando GitHub Releases...' });

    try {
      const update = await window.volumemax?.checkForUpdates?.();
      if (update && update.version) {
        setUpdateStatus({
          status: 'available',
          message: `Nova versão ${update.version} disponível!`,
        });
      } else {
        setUpdateStatus({
          status: 'latest',
          message: 'Você já está na versão mais recente (v2.0.0)',
        });
      }
    } catch {
      setUpdateStatus({
        status: 'error',
        message: 'Falha ao conectar ao GitHub. Tente novamente.',
      });
    } finally {
      setCheckingUpdate(false);
    }
  };

  const isApoInstalled = engineStatus?.installed ?? false;

  return (
    <>
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
          {/* Seção 1: Geral */}
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

          {/* Seção 2: Motor de Amplificação */}
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
                      color: '#000',
                      border: 'none',
                      fontSize: 'var(--text-xs)',
                      fontWeight: 700,
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

          {/* Seção 3: Atalhos Globais */}
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

          {/* Seção 4: Informações e Atualizações */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 'var(--space-md)' }}>
              <ShieldCheck size={12} />
              <span>Atualizações e Informações</span>
            </div>

            {/* Linha Verificar Atualizações */}
            <div className="setting-row" style={{ alignItems: 'center', gap: '10px' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="setting-row__label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <RefreshCw size={13} style={{ color: 'var(--color-primary)' }} />
                  Verificar Atualizações
                </div>
                <div
                  className="setting-row__description"
                  style={{
                    color: updateStatus.status === 'available'
                      ? '#818cf8'
                      : updateStatus.status === 'latest'
                      ? 'var(--color-success)'
                      : 'var(--text-tertiary)',
                  }}
                >
                  {updateStatus.message}
                </div>
              </div>

              <button
                type="button"
                id="btn-check-updates"
                onClick={handleCheckUpdates}
                disabled={checkingUpdate}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  background: updateStatus.status === 'available'
                    ? 'linear-gradient(135deg, #6366f1, #4f46e5)'
                    : 'rgba(255, 255, 255, 0.06)',
                  color: updateStatus.status === 'available' ? '#fff' : 'var(--text-primary)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: checkingUpdate ? 'not-allowed' : 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s',
                }}
              >
                <RefreshCw
                  size={12}
                  style={{
                    animation: checkingUpdate ? 'spin 1s linear infinite' : 'none',
                  }}
                />
                {checkingUpdate ? 'Checando...' : 'Verificar'}
              </button>
            </div>

            {/* Botão Modal Termos de Uso */}
            <button
              type="button"
              id="btn-open-terms"
              onClick={() => setShowTermsModal(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                padding: '10px 0',
                background: 'transparent',
                border: 'none',
                borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                color: 'inherit',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={14} style={{ color: 'var(--color-primary)' }} />
                <div>
                  <div className="setting-row__label">Termos de Uso e Licença</div>
                  <div className="setting-row__description">Responsabilidade, saúde auditiva e termos do software</div>
                </div>
              </div>
              <ChevronRight size={14} style={{ color: 'var(--text-tertiary)' }} />
            </button>

            {/* Botão Modal Sobre */}
            <button
              type="button"
              id="btn-open-about"
              onClick={() => setShowAboutModal(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                padding: '10px 0',
                background: 'transparent',
                border: 'none',
                borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                color: 'inherit',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Info size={14} style={{ color: 'var(--color-primary)' }} />
                <div>
                  <div className="setting-row__label">Sobre o VolumeMax</div>
                  <div className="setting-row__description">Versão, motor de som e informações de desenvolvimento</div>
                </div>
              </div>
              <ChevronRight size={14} style={{ color: 'var(--text-tertiary)' }} />
            </button>
          </div>

          {/* Rodapé */}
          <div style={{ marginTop: 'auto', paddingTop: 'var(--space-md)', borderTop: 'var(--border-subtle)' }}>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', textAlign: 'center' }}>
              VolumeMax v2.0.0
            </div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', textAlign: 'center', marginTop: '4px' }}>
              Motor Equalizer APO Integrado — Zero FxSound
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Termos de Uso */}
      {showTermsModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            animation: 'fadeIn 0.2s ease',
          }}
          onClick={() => setShowTermsModal(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '380px',
              maxHeight: '85vh',
              background: 'var(--bg-secondary)',
              border: '1px solid rgba(0, 229, 255, 0.3)',
              borderRadius: '12px',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 20px 40px rgba(0,0,0,0.8)',
              overflow: 'hidden',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Modal */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 16px',
                borderBottom: 'var(--border-subtle)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={16} style={{ color: 'var(--color-primary)' }} />
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Termos de Uso e Licença
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowTermsModal(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-tertiary)',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Conteúdo com rolagem */}
            <div
              style={{
                padding: '14px 16px',
                overflowY: 'auto',
                fontSize: '11px',
                lineHeight: 1.6,
                color: 'var(--text-secondary)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <div>
                <strong style={{ color: 'var(--text-primary)' }}>1. FINALIDADE E FUNCIONAMENTO:</strong>
                <p style={{ marginTop: '4px' }}>
                  O VolumeMax é uma ferramenta avançada de aprimoramento, gerenciamento de sessões e amplificação de áudio no sistema operacional Windows. Ele oferece controle nativo de 0% a 100% sobre o volume mestre e amplificação estendida de 101% a 500%.
                </p>
              </div>

              <div>
                <strong style={{ color: 'var(--text-primary)' }}>2. MOTOR DE AMPLIFICAÇÃO (EQUALIZER APO):</strong>
                <p style={{ marginTop: '4px' }}>
                  Para permitir que o volume ultrapasse os 100% com alta fidelidade e sem latência, o VolumeMax opera diretamente integrado com o Equalizer APO, um processador de sinal de áudio (Audio Processing Object) de código aberto que se conecta ao driver de som do Windows.
                </p>
              </div>

              <div>
                <strong style={{ color: '#f59e0b' }}>3. RESPONSABILIDADE DO USUÁRIO E SAÚDE AUDITIVA:</strong>
                <p style={{ marginTop: '4px' }}>
                  O usuário reconhece que volumes extremamente elevados (acima de 100% até 500%) podem causar fadiga auditiva ou riscos à saúde caso utilizados de forma prolongada, especialmente com o uso de fones de ouvido. Recomenda-se elevar o nível de ganho gradualmente e com moderação.
                </p>
              </div>

              <div>
                <strong style={{ color: 'var(--text-primary)' }}>4. LIMITAÇÃO DE RESPONSABILIDADE:</strong>
                <p style={{ marginTop: '4px' }}>
                  O software é fornecido gratuitamente "como está", sem garantias expressas ou implícitas de qualquer natureza. Em nenhuma hipótese os desenvolvedores serão responsabilizados por eventuais danos em equipamentos de reprodução decorrentes de sobrecarga.
                </p>
              </div>
            </div>

            {/* Rodapé Modal */}
            <div
              style={{
                padding: '12px 16px',
                borderTop: 'var(--border-subtle)',
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              <button
                type="button"
                onClick={() => setShowTermsModal(false)}
                style={{
                  padding: '6px 16px',
                  borderRadius: '6px',
                  background: 'var(--color-primary)',
                  color: '#000',
                  border: 'none',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Sobre */}
      {showAboutModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            animation: 'fadeIn 0.2s ease',
          }}
          onClick={() => setShowAboutModal(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '380px',
              background: 'var(--bg-secondary)',
              border: '1px solid rgba(0, 229, 255, 0.3)',
              borderRadius: '12px',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 20px 40px rgba(0,0,0,0.8)',
              overflow: 'hidden',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Modal */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 16px',
                borderBottom: 'var(--border-subtle)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Info size={16} style={{ color: 'var(--color-primary)' }} />
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Sobre o VolumeMax
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowAboutModal(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-tertiary)',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Conteúdo */}
            <div
              style={{
                padding: '16px',
                fontSize: '11px',
                lineHeight: 1.6,
                color: 'var(--text-secondary)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <div style={{ textAlign: 'center', padding: '8px 0' }}>
                <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '0.5px' }}>
                  Volume<span style={{ color: 'var(--color-primary)' }}>MAX</span>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--color-primary)', fontWeight: 600, marginTop: '2px' }}>
                  Versão 2.0.0
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', marginTop: '4px' }}>
                  Amplificador de Volume de Alta Fidelidade para Windows
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: 'var(--border-subtle)',
                  borderRadius: '8px',
                  padding: '10px 12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  fontSize: '10.5px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-tertiary)' }}>Motor de Áudio:</span>
                  <strong style={{ color: 'var(--color-primary)' }}>Equalizer APO (Nativo)</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-tertiary)' }}>Driver Virtual:</span>
                  <span style={{ color: 'var(--color-success)' }}>Zero FxSound (Livre)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-tertiary)' }}>Amplificação Estendida:</span>
                  <span style={{ color: 'var(--text-primary)' }}>101% até 500% (+14.0 dB)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-tertiary)' }}>Controle de Processos:</span>
                  <span style={{ color: 'var(--text-primary)' }}>WASAPI CoreAudio C#</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-tertiary)' }}>Desenvolvedor:</span>
                  <span style={{ color: 'var(--text-primary)' }}>Neyvan Santos</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  window.volumemax?.openExternal?.('https://github.com/NeyvanSantos/VolumeMAX---Codigo-Fonte');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  background: 'rgba(0, 229, 255, 0.1)',
                  color: 'var(--color-primary)',
                  border: '1px solid rgba(0, 229, 255, 0.3)',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  marginTop: '4px',
                }}
              >
                <ExternalLink size={13} />
                Ver Repositório no GitHub
              </button>
            </div>

            {/* Rodapé Modal */}
            <div
              style={{
                padding: '10px 16px',
                borderTop: 'var(--border-subtle)',
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              <button
                type="button"
                onClick={() => setShowAboutModal(false)}
                style={{
                  padding: '6px 16px',
                  borderRadius: '6px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  color: 'var(--text-primary)',
                  border: 'none',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default SettingsPanel;
