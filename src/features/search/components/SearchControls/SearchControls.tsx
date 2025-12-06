import { AlgorithmType, DataPattern, ExecutionState } from '../../../../types';
import { algorithmInfoMap } from '../../algorithms';
import { Button } from '../../../../components/Button';
import { Select, SelectOption } from '../../../../components/Select';
import { Input } from '../../../../components/Input';
import { Slider } from '../../../../components/Slider';
import styles from './SearchControls.module.css';

export interface SearchControlsProps {
  algorithm: AlgorithmType;
  onAlgorithmChange: (algorithm: AlgorithmType) => void;
  text: string;
  onTextChange: (text: string) => void;
  pattern: string;
  onPatternChange: (pattern: string) => void;
  dataPattern: DataPattern;
  onDataPatternChange: (pattern: DataPattern) => void;
  textLength: number;
  onTextLengthChange: (length: number) => void;
  patternLength: number;
  onPatternLengthChange: (length: number) => void;
  executionState: ExecutionState;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
  onGenerateData: () => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  error?: string;
}

const algorithmOptions: SelectOption[] = [
  { value: 'brute-force', label: '力まかせ法' },
  { value: 'kmp', label: 'KMP法' },
  { value: 'boyer-moore', label: 'Boyer-Moore法' },
];

const dataPatternOptions: SelectOption[] = [
  { value: 'random', label: 'ランダム' },
  { value: 'repeated', label: '反復パターン' },
  { value: 'partial-match', label: '部分一致多数' },
  { value: 'worst-case', label: '最悪ケース' },
];

export function SearchControls(props: SearchControlsProps) {
  const {
    algorithm,
    onAlgorithmChange,
    text,
    onTextChange,
    pattern,
    onPatternChange,
    dataPattern,
    onDataPatternChange,
    textLength,
    onTextLengthChange,
    patternLength,
    onPatternLengthChange,
    executionState,
    onStart,
    onPause,
    onResume,
    onReset,
    onGenerateData,
    speed,
    onSpeedChange,
    error,
  } = props;

  const algorithmInfo = algorithmInfoMap[algorithm];
  const isRunning = executionState === 'running';
  const isPaused = executionState === 'paused';
  const isCompleted = executionState === 'completed';

  const handleExecutionToggle = () => {
    if (isRunning) {
      onPause();
    } else if (isPaused) {
      onResume();
    } else {
      onStart();
    }
  };

  const getExecutionButtonLabel = () => {
    if (isRunning) return '一時停止';
    if (isPaused) return '再開';
    return '実行';
  };

  return (
    <div className={styles.container}>
      <div className={styles.inputGroup}>
        <Select
          label="アルゴリズム"
          options={algorithmOptions}
          value={algorithm}
          onChange={(e) => onAlgorithmChange(e.target.value as AlgorithmType)}
          disabled={isRunning || isPaused}
        />
        <Select
          label="データパターン"
          options={dataPatternOptions}
          value={dataPattern}
          onChange={(e) => onDataPatternChange(e.target.value as DataPattern)}
          disabled={isRunning || isPaused}
        />
      </div>

      <div className={styles.inputGroup}>
        <Input
          label={`テキスト長 (${text.length}文字)`}
          type="number"
          min={1}
          max={100}
          value={textLength}
          onChange={(e) => onTextLengthChange(Number(e.target.value))}
          disabled={isRunning || isPaused}
        />
        <Input
          label={`パターン長 (${pattern.length}文字)`}
          type="number"
          min={1}
          max={50}
          value={patternLength}
          onChange={(e) => onPatternLengthChange(Number(e.target.value))}
          disabled={isRunning || isPaused}
        />
      </div>

      <div className={styles.inputGroup}>
        <Input
          label="テキスト"
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          disabled={isRunning || isPaused}
          error={error}
        />
        <Input
          label="パターン"
          value={pattern}
          onChange={(e) => onPatternChange(e.target.value)}
          disabled={isRunning || isPaused}
        />
      </div>

      <div className={styles.controls}>
        <div className={styles.buttonGroup}>
          <Button
            variant="primary"
            onClick={handleExecutionToggle}
            disabled={!!error || isCompleted}
          >
            {getExecutionButtonLabel()}
          </Button>
          <Button
            variant="secondary"
            onClick={onReset}
            disabled={executionState === 'idle'}
          >
            リセット
          </Button>
          <Button
            variant="outline"
            onClick={onGenerateData}
            disabled={isRunning || isPaused}
          >
            データ生成
          </Button>
        </div>

        <div className={styles.sliderContainer}>
          <Slider
            label="アニメーション速度"
            min={0.25}
            max={3}
            step={0.25}
            value={speed}
            onChange={(e) => onSpeedChange(Number(e.target.value))}
          />
        </div>
      </div>

      {algorithmInfo && (
        <div className={styles.algorithmInfo}>
          <div className={styles.algorithmName}>{algorithmInfo.name}</div>
          <div className={styles.algorithmDescription}>{algorithmInfo.description}</div>
          <div className={styles.complexityGrid}>
            <div className={styles.complexityItem}>
              <span className={styles.complexityLabel}>最良:</span>
              <span className={styles.complexityValue}>{algorithmInfo.timeComplexity.best}</span>
            </div>
            <div className={styles.complexityItem}>
              <span className={styles.complexityLabel}>平均:</span>
              <span className={styles.complexityValue}>{algorithmInfo.timeComplexity.average}</span>
            </div>
            <div className={styles.complexityItem}>
              <span className={styles.complexityLabel}>最悪:</span>
              <span className={styles.complexityValue}>{algorithmInfo.timeComplexity.worst}</span>
            </div>
            <div className={styles.complexityItem}>
              <span className={styles.complexityLabel}>空間:</span>
              <span className={styles.complexityValue}>{algorithmInfo.spaceComplexity}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
