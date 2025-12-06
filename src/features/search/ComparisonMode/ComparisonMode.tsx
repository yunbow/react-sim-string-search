import { useState, useEffect } from 'react';
import { AlgorithmType, DataPattern } from '../../../types';
import { useSearchSimulator } from '../hooks/useSearchSimulator';
import { Select, SelectOption } from '../../../components/Select';
import { Button } from '../../../components/Button';
import { Slider } from '../../../components/Slider';
import { Input } from '../../../components/Input';
import { StringVisualizer } from '../components/StringVisualizer';
import { SearchStats } from '../components/SearchStats';
import styles from './ComparisonMode.module.css';

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

export function ComparisonMode() {
  const [leftAlgorithm, setLeftAlgorithm] = useState<AlgorithmType>('brute-force');
  const [rightAlgorithm, setRightAlgorithm] = useState<AlgorithmType>('kmp');
  const [sharedText, setSharedText] = useState('');
  const [sharedPattern, setSharedPattern] = useState('');
  const [dataPattern, setDataPattern] = useState<DataPattern>('random');
  const [textLength, setTextLength] = useState(20);
  const [patternLength, setPatternLength] = useState(3);

  const leftSim = useSearchSimulator();
  const rightSim = useSearchSimulator();

  // 初期データ生成
  useEffect(() => {
    if (!sharedText && !sharedPattern) {
      leftSim.setDataPattern(dataPattern);
      leftSim.setTextLength(textLength);
      leftSim.setPatternLength(patternLength);
      leftSim.generateNewData();

      setTimeout(() => {
        setSharedText(leftSim.text);
        setSharedPattern(leftSim.pattern);
      }, 100);
    }
  }, []);

  // 共有データが変更されたら両方のシミュレータに反映
  useEffect(() => {
    if (sharedText) {
      leftSim.setText(sharedText);
      rightSim.setText(sharedText);
    }
  }, [sharedText]);

  useEffect(() => {
    if (sharedPattern) {
      leftSim.setPattern(sharedPattern);
      rightSim.setPattern(sharedPattern);
    }
  }, [sharedPattern]);

  const handleGenerateData = () => {
    leftSim.generateNewData({
      pattern: dataPattern,
      textLen: textLength,
      patternLen: patternLength,
    });

    setTimeout(() => {
      setSharedText(leftSim.text);
      setSharedPattern(leftSim.pattern);
    }, 0);
  };

  const handleStartBoth = () => {
    // 両方のシミュレータに同じデータを設定
    leftSim.setText(sharedText);
    leftSim.setPattern(sharedPattern);
    rightSim.setText(sharedText);
    rightSim.setPattern(sharedPattern);

    setTimeout(() => {
      leftSim.start(leftAlgorithm);
      rightSim.start(rightAlgorithm);
    }, 0);
  };

  const handlePauseBoth = () => {
    leftSim.pause();
    rightSim.pause();
  };

  const handleResumeBoth = () => {
    leftSim.resume();
    rightSim.resume();
  };

  const handleResetBoth = () => {
    leftSim.reset();
    rightSim.reset();
  };

  const isRunning = leftSim.executionState === 'running' || rightSim.executionState === 'running';
  const isPaused = leftSim.executionState === 'paused' || rightSim.executionState === 'paused';
  const isIdle = leftSim.executionState === 'idle' && rightSim.executionState === 'idle';

  return (
    <div className={styles.container}>
      <div>
        <h1 className={styles.title}>アルゴリズム比較モード</h1>
        <p className={styles.subtitle}>
          2つのアルゴリズムを同時に実行して性能を比較できます
        </p>
      </div>

      {/* 共通コントロール */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1.5rem', backgroundColor: 'var(--color-card)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
        {/* アルゴリズム選択 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <Select
            label="左側アルゴリズム"
            options={algorithmOptions}
            value={leftAlgorithm}
            onChange={(e) => setLeftAlgorithm(e.target.value as AlgorithmType)}
            disabled={!isIdle}
          />
          <Select
            label="右側アルゴリズム"
            options={algorithmOptions}
            value={rightAlgorithm}
            onChange={(e) => setRightAlgorithm(e.target.value as AlgorithmType)}
            disabled={!isIdle}
          />
          <Select
            label="データパターン"
            options={dataPatternOptions}
            value={dataPattern}
            onChange={(e) => setDataPattern(e.target.value as DataPattern)}
            disabled={!isIdle}
          />
        </div>

        {/* データサイズ設定 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <Input
            label={`テキスト長 (${sharedText.length}文字)`}
            type="number"
            min={1}
            max={100}
            value={textLength}
            onChange={(e) => setTextLength(Number(e.target.value))}
            disabled={!isIdle}
          />
          <Input
            label={`パターン長 (${sharedPattern.length}文字)`}
            type="number"
            min={1}
            max={50}
            value={patternLength}
            onChange={(e) => setPatternLength(Number(e.target.value))}
            disabled={!isIdle}
          />
        </div>

        {/* テキストとパターン入力 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
          <Input
            label="テキスト（共通）"
            value={sharedText}
            onChange={(e) => setSharedText(e.target.value)}
            disabled={!isIdle}
          />
          <Input
            label="パターン（共通）"
            value={sharedPattern}
            onChange={(e) => setSharedPattern(e.target.value)}
            disabled={!isIdle}
          />
        </div>

        {/* 実行コントロール */}
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <Button
              variant="primary"
              onClick={isRunning ? handlePauseBoth : (isPaused ? handleResumeBoth : handleStartBoth)}
              disabled={!sharedText || !sharedPattern || sharedPattern.length > sharedText.length}
            >
              {isRunning ? '一時停止' : (isPaused ? '再開' : '両方実行')}
            </Button>
            <Button variant="secondary" onClick={handleResetBoth} disabled={isIdle}>
              リセット
            </Button>
            <Button variant="outline" onClick={handleGenerateData} disabled={!isIdle}>
              データ生成
            </Button>
          </div>

          <div style={{ flex: 1, minWidth: '200px' }}>
            <Slider
              label="アニメーション速度"
              min={0.25}
              max={3}
              step={0.25}
              value={leftSim.speed}
              onChange={(e) => {
                const speed = Number(e.target.value);
                leftSim.setSpeed(speed);
                rightSim.setSpeed(speed);
              }}
            />
          </div>
        </div>
      </div>

      {/* 比較パネル */}
      <div className={styles.comparison}>
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            {algorithmOptions.find(opt => opt.value === leftAlgorithm)?.label}
          </div>
          <StringVisualizer
            text={sharedText}
            pattern={sharedPattern}
            textStates={leftSim.textStates}
            patternStates={leftSim.patternStates}
            showLegend={false}
          />
          <SearchStats
            statistics={leftSim.statistics}
            logs={leftSim.logs}
            currentStep={leftSim.currentStep || undefined}
          />
        </div>

        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            {algorithmOptions.find(opt => opt.value === rightAlgorithm)?.label}
          </div>
          <StringVisualizer
            text={sharedText}
            pattern={sharedPattern}
            textStates={rightSim.textStates}
            patternStates={rightSim.patternStates}
            showLegend={false}
          />
          <SearchStats
            statistics={rightSim.statistics}
            logs={rightSim.logs}
            currentStep={rightSim.currentStep || undefined}
          />
        </div>
      </div>
    </div>
  );
}
