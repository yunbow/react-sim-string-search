import { StepInfo, CharacterState } from '../../../types';

// Bad Character テーブルを作成
function buildBadCharTable(pattern: string): Map<string, number> {
  const table = new Map<string, number>();
  const m = pattern.length;

  for (let i = 0; i < m - 1; i++) {
    table.set(pattern[i], m - 1 - i);
  }

  return table;
}

export function* boyerMooreSearch(text: string, pattern: string): Generator<StepInfo> {
  const n = text.length;
  const m = pattern.length;
  let stepNumber = 0;
  const matchPositions: number[] = [];

  // Bad Character テーブルを構築
  const badCharTable = buildBadCharTable(pattern);

  stepNumber++;
  const tableEntries = Array.from(badCharTable.entries())
    .map(([char, shift]) => `'${char}':${shift}`)
    .join(', ');
  yield {
    stepNumber,
    textIndex: -1,
    patternIndex: -1,
    description: `Boyer-Moore 前処理: Bad Character テーブル = {${tableEntries}}`,
    textStates: new Array(n).fill('unprocessed'),
    patternStates: new Array(m).fill('unprocessed'),
    isMatch: false,
  };

  let i = 0; // テキストの開始位置

  while (i <= n - m) {
    let j = m - 1; // パターンの末尾から比較

    // パターンを右から左に比較
    while (j >= 0) {
      stepNumber++;

      const textStates: CharacterState[] = new Array(n).fill('unprocessed');
      const patternStates: CharacterState[] = new Array(m).fill('unprocessed');

      // 現在のパターン位置を表示
      for (let k = 0; k < m; k++) {
        textStates[i + k] = 'pattern-position';
      }

      // 一致している部分
      for (let k = j + 1; k < m; k++) {
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
        // 不一致の場合、Bad Character ルールを適用
        const badChar = text[i + j];
        const shift = badCharTable.get(badChar) ?? m;

        stepNumber++;
        const shiftedTextStates: CharacterState[] = new Array(n).fill('unprocessed');
        const shiftedPatternStates: CharacterState[] = new Array(m).fill('unprocessed');

        shiftedTextStates[i + j] = 'mismatched';
        shiftedPatternStates[j] = 'mismatched';

        // シフト後の位置を表示
        for (let k = 0; k < m && i + shift + k < n; k++) {
          shiftedTextStates[i + shift + k] = 'pattern-position';
        }

        yield {
          stepNumber,
          textIndex: i + j,
          patternIndex: j,
          description: `不一致: '${badChar}' のシフト量 = ${shift} → パターンを ${shift} 文字シフト`,
          textStates: shiftedTextStates,
          patternStates: shiftedPatternStates,
          isMatch: false,
          shiftAmount: shift,
        };

        i += shift;
        break;
      }

      j--;
    }

    // パターン全体が一致した場合
    if (j < 0) {
      const foundTextStates: CharacterState[] = new Array(n).fill('unprocessed');
      const foundPatternStates: CharacterState[] = new Array(m).fill('matching');

      for (let k = 0; k < m; k++) {
        foundTextStates[i + k] = 'found';
      }

      matchPositions.push(i);

      stepNumber++;
      yield {
        stepNumber,
        textIndex: i,
        patternIndex: 0,
        description: `位置 ${i} でパターンが一致しました！`,
        textStates: foundTextStates,
        patternStates: foundPatternStates,
        isMatch: true,
      };

      // 次の検索位置に移動
      i += m;
    }
  }

  // 最終結果
  stepNumber++;
  const finalTextStates: CharacterState[] = new Array(n).fill('unprocessed');
  const finalPatternStates: CharacterState[] = new Array(m).fill('unprocessed');

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

export const boyerMooreInfo = {
  name: 'ボイヤー・ムーア法（Boyer-Moore）',
  description: 'パターンを右から左に比較し、不一致時に大きくスキップすることで高速化します。',
  timeComplexity: {
    best: 'O(n/m)',
    average: 'O(n + m)',
    worst: 'O(n×m)',
  },
  spaceComplexity: 'O(m)',
};
