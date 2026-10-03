import type { AudioLevels } from '../types/audio';

interface LevelMeterProps {
  levels: AudioLevels;
}

function LevelMeter({ levels }: LevelMeterProps) {
  const leftDb = levels.left > 0 ? Math.round(20 * Math.log10(levels.left)) : -60;
  const rightDb = levels.right > 0 ? Math.round(20 * Math.log10(levels.right)) : -60;

  return (
    <div className="level-meter">
      <div className="level-meter__channel">
        <span className="level-meter__label">L</span>
        <div className="level-meter__bar">
          <div
            className={`level-meter__fill ${levels.clipping ? 'level-meter__fill--clipping' : ''}`}
            style={{ width: `${levels.left * 100}%` }}
          />
        </div>
        <span className="level-meter__db">{leftDb > -60 ? `${leftDb}dB` : '-∞'}</span>
      </div>
      <div className="level-meter__channel">
        <span className="level-meter__label">R</span>
        <div className="level-meter__bar">
          <div
            className={`level-meter__fill ${levels.clipping ? 'level-meter__fill--clipping' : ''}`}
            style={{ width: `${levels.right * 100}%` }}
          />
        </div>
        <span className="level-meter__db">{rightDb > -60 ? `${rightDb}dB` : '-∞'}</span>
      </div>
    </div>
  );
}

export default LevelMeter;
