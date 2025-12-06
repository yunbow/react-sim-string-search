import { CharacterState } from '../../../../types';
import styles from './StringVisualizer.module.css';

export interface StringVisualizerProps {
  text: string;
  pattern: string;
  textStates: CharacterState[];
  patternStates: CharacterState[];
  showLegend?: boolean;
}

const stateClassMap: Record<CharacterState, string> = {
  'unprocessed': styles.unprocessed,
  'comparing': styles.comparing,
  'matching': styles.matching,
  'mismatched': styles.mismatched,
  'found': styles.found,
  'pattern-position': styles.patternPosition,
};

const legendItems = [
  { state: 'unprocessed', label: '未処理', color: 'var(--color-unprocessed)' },
  { state: 'comparing', label: '比較中', color: 'var(--color-comparing)' },
  { state: 'matching', label: '一致', color: 'var(--color-matching)' },
  { state: 'mismatched', label: '不一致', color: 'var(--color-mismatched)' },
  { state: 'found', label: '発見', color: 'var(--color-found)' },
  { state: 'pattern-position', label: 'パターン位置', color: 'var(--color-pattern-position)' },
];

export function StringVisualizer({
  text,
  pattern,
  textStates,
  patternStates,
  showLegend = true,
}: StringVisualizerProps) {
  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <div className={styles.label}>テキスト</div>
        <div className={styles.stringContainer}>
          {text.split('').map((char, index) => {
            const state = textStates[index] || 'unprocessed';
            return (
              <div key={index} className={`${styles.character} ${stateClassMap[state]}`}>
                {char}
              </div>
            );
          })}
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.label}>パターン</div>
        <div className={styles.stringContainer}>
          {pattern.split('').map((char, index) => {
            const state = patternStates[index] || 'unprocessed';
            return (
              <div key={index} className={`${styles.character} ${stateClassMap[state]}`}>
                {char}
              </div>
            );
          })}
        </div>
      </div>

      {showLegend && (
        <div className={styles.legend}>
          {legendItems.map((item) => (
            <div key={item.state} className={styles.legendItem}>
              <div
                className={styles.legendColor}
                style={{ backgroundColor: item.color }}
              />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
