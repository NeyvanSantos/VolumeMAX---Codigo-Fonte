import { Keyboard, ArrowUp, ArrowDown } from 'lucide-react';

function HotkeyHint() {
  return (
    <div className="hotkey-hint animate-in">
      <div className="hotkey-hint__group">
        <Keyboard size={13} className="hotkey-hint__icon" />
        <span className="hotkey-hint__key">
          Ctrl + Shift + <ArrowUp size={11} className="hotkey-hint__arrow" />
        </span>
        <span className="hotkey-hint__text">Boost +</span>
      </div>
      <span className="hotkey-hint__divider">│</span>
      <div className="hotkey-hint__group">
        <span className="hotkey-hint__key">
          Ctrl + Shift + <ArrowDown size={11} className="hotkey-hint__arrow" />
        </span>
        <span className="hotkey-hint__text">Boost -</span>
      </div>
    </div>
  );
}

export default HotkeyHint;
