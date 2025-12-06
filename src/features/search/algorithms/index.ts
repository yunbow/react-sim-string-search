import { AlgorithmType, AlgorithmInfo, StepInfo } from '../../../types';
import { bruteForceSearch, bruteForceInfo } from './bruteForce';
import { kmpSearch, kmpInfo } from './kmp';
import { boyerMooreSearch, boyerMooreInfo } from './boyerMoore';

export type SearchAlgorithm = (text: string, pattern: string) => Generator<StepInfo>;

export const algorithms: Record<AlgorithmType, SearchAlgorithm> = {
  'brute-force': bruteForceSearch,
  'kmp': kmpSearch,
  'boyer-moore': boyerMooreSearch,
};

export const algorithmInfoMap: Record<AlgorithmType, AlgorithmInfo> = {
  'brute-force': bruteForceInfo,
  'kmp': kmpInfo,
  'boyer-moore': boyerMooreInfo,
};

export { bruteForceSearch, kmpSearch, boyerMooreSearch };
