import { useState, useEffect } from 'react';
import { Download, ArrowUpCircle, X, Loader2, CheckCircle } from 'lucide-react';

interface UpdateInfo {
  version: string;
  downloadUrl: string;
  fileName: string;
  releaseNotes: string;
}

type UpdateState = 'idle' | 'available' | 'downloading' | 'done' | 'error';

function UpdateBanner() {
  const [state, setState] = useState<UpdateState>('idle');
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null);
  const [progress, setProgress] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Escuta aviso automático vindo do backend (verificação feita 5s após iniciar)
    const cleanupAvailable = window.volumemax?.onUpdateAvailable?.((info) => {
      setUpdateInfo(info);
      setState('available');
    });

    // Escuta progresso do download
    const cleanupProgress = window.volumemax?.onUpdateDownloadProgress?.((percent) => {
      setProgress(percent);
    });

    return () => {
      if (typeof cleanupAvailable === 'function') cleanupAvailable();
      if (typeof cleanupProgress === 'function') cleanupProgress();
    };
  }, []);

  const handleUpdate = async () => {
    if (!updateInfo) return;
    setState('downloading');
    setProgress(0);

    const result = await window.volumemax?.downloadAndInstallUpdate?.(updateInfo);
    if (result?.success) {
      setState('done');
    } else {
      setState('error');
    }
  };

  if (dismissed || state === 'idle') return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '0',
        left: '0',
        right: '0',
        zIndex: 9999,
        padding: '10px 14px',
        background: state === 'error'
          ? 'linear-gradient(135deg, rgba(239,68,68,0.18), rgba(239,68,68,0.08))'
          : 'linear-gradient(135deg, rgba(59,130,246,0.20), rgba(99,102,241,0.12))',
        borderTop: `1px solid ${state === 'error' ? 'rgba(239,68,68,0.3)' : 'rgba(99,102,241,0.35)'}`,
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        animation: 'slideUp 0.35s ease',
      }}
    >
      {/* Ícone */}
      <div style={{ flexShrink: 0 }}>
        {state === 'available' && <ArrowUpCircle size={20} style={{ color: '#818cf8' }} />}
        {state === 'downloading' && <Loader2 size={20} style={{ color: '#60a5fa', animation: 'spin 1s linear infinite' }} />}
        {state === 'done' && <CheckCircle size={20} style={{ color: '#4ade80' }} />}
        {state === 'error' && <X size={20} style={{ color: '#f87171' }} />}
      </div>

      {/* Texto */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {state === 'available' && (
          <>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#e2e8f0', lineHeight: 1.3 }}>
              Nova versão disponível: <span style={{ color: '#818cf8' }}>{updateInfo?.version}</span>
            </div>
            <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '1px' }}>
              Clique em Atualizar para baixar e instalar automaticamente.
            </div>
          </>
        )}
        {state === 'downloading' && (
          <>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#e2e8f0', lineHeight: 1.3 }}>
              Baixando atualização… {progress}%
            </div>
            <div
              style={{
                marginTop: '4px',
                height: '4px',
                borderRadius: '4px',
                background: 'rgba(255,255,255,0.1)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${progress}%`,
                  borderRadius: '4px',
                  background: 'linear-gradient(90deg, #6366f1, #60a5fa)',
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
          </>
        )}
        {state === 'done' && (
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#4ade80' }}>
            Download concluído! Aplicando atualização e reiniciando o VolumeMax…
          </div>
        )}
        {state === 'error' && (
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#f87171' }}>
            Falha ao baixar a atualização. Verifique sua conexão.
          </div>
        )}
      </div>

      {/* Botões */}
      <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
        {state === 'available' && (
          <button
            type="button"
            id="btn-update-now"
            onClick={handleUpdate}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '5px 12px',
              borderRadius: '6px',
              background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
              color: '#fff',
              border: 'none',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            <Download size={12} />
            Atualizar Agora
          </button>
        )}
        {(state === 'available' || state === 'error') && (
          <button
            type="button"
            id="btn-dismiss-update"
            onClick={() => setDismissed(true)}
            title="Fechar aviso"
            style={{
              padding: '5px',
              borderRadius: '5px',
              background: 'rgba(255,255,255,0.06)',
              color: '#64748b',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <X size={13} />
          </button>
        )}
      </div>
    </div>
  );
}

export default UpdateBanner;
