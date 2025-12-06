import { StepInfo, CharacterState } from '../../../types';

export function* bruteForceSearch(text: string, pattern: string): Generator<StepInfo> {
  const n = text.length;
  const m = pattern.length;
  let stepNumber = 0;
  const matchPositions: number[] = [];

  for (let i = 0; i <= n - m; i++) {
    let j = 0;

    // パターンの各文字を比較
    while (j < m) {
      stepNumber++;

      const textStates: CharacterState[] = new Array(n).fill('unprocessed');
      const patternStates: CharacterState[] = new Array(m).fill('unprocessed');

      // 現在の位置を表示
      for (let k = 0; k < j; k++) {
        textStates[i + k] = 'matching';
        patternStates[k] = 'matching';
      }

      // 比較中の文字
      textStates[i + j] = 'comparing';
      patternStates[j] = 'comparing';

      const isMatch = text[i + j] === pattern[j];

      yield {
        stepNumber,
        textIndex: i + j,
        patternIndex: j,
        description: `text[${i + j}] ('${text[i + j]}') と pattern[${j}] ('${pattern[j]}') を比較 → ${isMatch ? '一致' : '不一致'}`,
        textStates,
        patternStates,
        isMatch,
      };

      if (!isMatch) {
        // 不一致の場合
        textStates[i + j] = 'mismatched';
        patternStates[j] = 'mismatched';

        stepNumber++;
        yield {
          stepNumber,
          textIndex: i + j,
          patternIndex: j,
          description: `不一致のため、パターンを1文字シフト`,
          textStates,
          patternStates,
          isMatch: false,
          shiftAmount: 1,
        };
        break;
      }

      j++;
    }

    // パターン全体が一致した場合
    if (j === m) {
      const textStates: CharacterState[] = new Array(n).fill('unprocessed');
      const patternStates: CharacterState[] = new Array(m).fill('matching');

      for (let k = 0; k < m; k++) {
        textStates[i + k] = 'found';
      }

      matchPositions.push(i);

      stepNumber++;
      yield {
        stepNumber,
        textIndex: i,
        patternIndex: 0,
        description: `位置 ${i} でパターンが一致しました！`,
        textStates,
        patternStates,
        isMatch: true,
      };
    }
  }

  // 最終結果
  stepNumber++;
  const finalTextStates: CharacterState[] = new Array(n).fill('unprocessed');
  const finalPatternStates: CharacterState[] = new Array(m).fill('unprocessed');

  // 一致した位置をマーク
  matchPositions.forEach((pos) => {
    for (let k = 0; k < m; k++) {
      finalTextStates[pos + k] = 'found';
    }
  });

  yield {
    stepNumber,
    textIndex: -1,
    patternIndex: -1,
    description: matchPositions.length > 0
      ? `検索完了: ${matchPositions.length}箇所で一致 (位置: ${matchPositions.join(', ')})`
      : '検索完了: パターンが見つかりませんでした',
    textStates: finalTextStates,
    patternStates: finalPatternStates,
    isMatch: matchPositions.length > 0,
  };
}

export const bruteForceInfo = {
  name: '力まかせ法（Brute-Force）',
  description: '最も単純な文字列探索アルゴリズム。テキストの各位置からパターンを順番に比較します。',
  timeComplexity: {
    best: 'O(n)',
    average: 'O(n×m)',
    worst: 'O(n×m)',
  },
  spaceComplexity: 'O(1)',
};
