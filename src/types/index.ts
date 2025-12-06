// アルゴリズムの種類
export type AlgorithmType = 'brute-force' | 'kmp' | 'boyer-moore';

// 実行状態
export type ExecutionState = 'idle' | 'running' | 'paused' | 'completed';

// 文字の状態
export type CharacterState = 'unprocessed' | 'comparing' | 'matching' | 'mismatched' | 'found' | 'pattern-position';

// 文字情報
export interface CharacterInfo {
  char: string;
  index: number;
  state: CharacterState;
}

// ステップ情報
export interface StepInfo {
  stepNumber: number;
  textIndex: number;
  patternIndex: number;
  description: string;
  textStates: CharacterState[];
  patternStates: CharacterState[];
  isMatch: boolean;
  shiftAmount?: number;
}

// 統計情報
export interface Statistics {
  comparisons: number;
  shifts: number;
  totalSteps: number;
  executionTime: number;
  matchPositions: number[];
}

// データ生成パターン
export type DataPattern = 'random' | 'repeated' | 'partial-match' | 'worst-case';

// データ生成設定
export interface DataGeneratorConfig {
  pattern: DataPattern;
  textLength: number;
  patternLength: number;
}

// アルゴリズム情報
export interface AlgorithmInfo {
  name: string;
  description: string;
  timeComplexity: {
    best: string;
    average: string;
    worst: string;
  };
  spaceComplexity: string;
}
