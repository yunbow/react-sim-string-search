import { useSearchSimulator } from '../hooks/useSearchSimulator';
import { SearchControls } from '../components/SearchControls';
import { StringVisualizer } from '../components/StringVisualizer';
import { SearchStats } from '../components/SearchStats';
import styles from './SearchSimulator.module.css';

export function SearchSimulator() {
  const simulator = useSearchSimulator();

  return (
    <div className={styles.container}>
      <div>
        <h1 className={styles.title}>文字列探索アルゴリズム可視化ツール</h1>
        <p className={styles.subtitle}>
          文字列探索アルゴリズムの動作を視覚的に理解するための学習ツールです
        </p>
      </div>

      <SearchControls
        algorithm={simulator.algorithm}
        onAlgorithmChange={simulator.setAlgorithm}
        text={simulator.text}
        onTextChange={simulator.setText}
        pattern={simulator.pattern}
        onPatternChange={simulator.setPattern}
        dataPattern={simulator.dataPattern}
        onDataPatternChange={simulator.setDataPattern}
        textLength={simulator.textLength}
        onTextLengthChange={simulator.setTextLength}
        patternLength={simulator.patternLength}
        onPatternLengthChange={simulator.setPatternLength}
        executionState={simulator.executionState}
        onStart={simulator.start}
        onPause={simulator.pause}
        onResume={simulator.resume}
        onReset={simulator.reset}
        onGenerateData={simulator.generateNewData}
        speed={simulator.speed}
        onSpeedChange={simulator.setSpeed}
        error={simulator.error}
      />

      <StringVisualizer
        text={simulator.text}
        pattern={simulator.pattern}
        textStates={simulator.textStates}
        patternStates={simulator.patternStates}
      />

      <SearchStats
        statistics={simulator.statistics}
        logs={simulator.logs}
        currentStep={simulator.currentStep || undefined}
      />
    </div>
  );
}
