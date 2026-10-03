import { Volume2, Settings, Minus, X } from 'lucide-react';

interface TitleBarProps {
  onSettings: () => void;
}

function TitleBar({ onSettings }: TitleBarProps) {
  const handleMinimize = () => {
    window.volumemax?.minimizeWindow?.();
  };

  const handleClose = () => {
    window.volumemax?.minimizeToTray?.();
  };

  return (
    <div className="titlebar">
      <div className="titlebar__logo">
        <Volume2 size={16} className="titlebar__logo-icon" />
        <span>VolumeMax</span>
      </div>
      <div className="titlebar__controls">
        <button
          className="titlebar__btn"
          onClick={onSettings}
          title="Configurações"
        >
          <Settings size={14} />
        </button>
        <button
          className="titlebar__btn"
          onClick={handleMinimize}
          title="Minimizar"
        >
          <Minus size={14} />
        </button>
        <button
          className="titlebar__btn titlebar__btn--close"
          onClick={handleClose}
          title="Minimizar para bandeja"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}

export default TitleBar;
