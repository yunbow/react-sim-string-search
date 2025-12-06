import { StepInfo, Statistics } from '../../../../types';
import styles from './SearchStats.module.css';

export interface SearchStatsProps {
  statistics: Statistics;
  logs: StepInfo[];
  currentStep?: StepInfo;
}

export function SearchStats({ statistics, logs, currentStep }: SearchStatsProps) {
  return (
    <div className={styles.container}>
      <div className={styles.statsContainer}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>比較回数</div>
          <div className={styles.statValue}>{statistics.comparisons}</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statLabel}>シフト回数</div>
          <div className={styles.statValue}>{statistics.shifts}</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statLabel}>ステップ数</div>
          <div className={styles.statValue}>{statistics.totalSteps}</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statLabel}>実行時間</div>
          <div className={styles.statValue}>{statistics.executionTime}ms</div>
        </div>

        {statistics.matchPositions.length > 0 && (
          <div className={styles.statCard}>
            <div className={styles.statLabel}>一致位置</div>
            <div className={styles.statValue}>
              {statistics.matchPositions.length}箇所
            </div>
          </div>
        )}
      </div>

      <div className={styles.logContainer}>
        <div className={styles.logHeader}>
          <span>実行ログ</span>
          {currentStep && (
            <span className={styles.currentStepLabel}>
              Step {currentStep.stepNumber}
            </span>
          )}
        </div>

        <div className={styles.logList}>
          {logs.length === 0 ? (
            <div className={styles.logEmpty}>
              アルゴリズムを実行すると、処理ログがここに表示されます
            </div>
          ) : (
            logs.slice().reverse().map((log, index) => {
              const isCurrentStep = currentStep?.stepNumber === log.stepNumber;
              return (
                <div
                  key={`${log.stepNumber}-${index}`}
                  className={`${styles.logItem} ${isCurrentStep ? styles.logItemCurrent : ''}`}
                >
                  <strong>Step {log.stepNumber}:</strong> {log.description}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
