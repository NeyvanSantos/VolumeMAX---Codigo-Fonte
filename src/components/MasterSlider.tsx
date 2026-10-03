import { useRef, useCallback, useEffect, useState } from 'react';

interface MasterSliderProps {
  value: number;
  onChange: (value: number) => void;
  muted: boolean;
}

function MasterSlider({ value, onChange, muted }: MasterSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const isClipping = value > 400;

  const getValueFromPosition = useCallback((clientX: number) => {
    if (!trackRef.current) return value;
    const rect = trackRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, x / rect.width));
    return Math.round(ratio * 500);
  }, [value]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setDragging(true);
    const newValue = getValueFromPosition(e.clientX);
    onChange(newValue);
  }, [getValueFromPosition, onChange]);

  useEffect(() => {
    if (!dragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const newValue = getValueFromPosition(e.clientX);
      onChange(newValue);
    };

    const handleMouseUp = () => {
      setDragging(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging, getValueFromPosition, onChange]);

  const fillPercent = (value / 500) * 100;
  const displayValue = muted ? 0 : value;

  return (
    <div className="master-slider">
      <div className="master-slider__label">Boost de Volume</div>
      <div
        className={`master-slider__value ${isClipping && !muted ? 'master-slider__value--clipping' : ''}`}
      >
        {displayValue}%
      </div>

      <div
        className="slider-track"
        ref={trackRef}
        onMouseDown={handleMouseDown}
      >
        <div className="slider-track__bg" />
        <div
          className="slider-track__fill"
          style={{
            width: `${fillPercent}%`,
            opacity: muted ? 0.3 : 1,
            boxShadow: dragging ? '0 0 20px var(--color-primary-glow)' : undefined,
          }}
        />
        <div
          className="slider-track__thumb"
          style={{
            left: `${fillPercent}%`,
            animation: dragging ? 'glowPulse 1s ease-in-out infinite' : undefined,
          }}
        />
        <div className="slider-track__markers">
          <span className="slider-track__marker">0%</span>
          <span className="slider-track__marker slider-track__marker--100">100%</span>
          <span className="slider-track__marker">200%</span>
          <span className="slider-track__marker">300%</span>
          <span className="slider-track__marker">400%</span>
          <span className="slider-track__marker">500%</span>
        </div>
      </div>
    </div>
  );
}

export default MasterSlider;
