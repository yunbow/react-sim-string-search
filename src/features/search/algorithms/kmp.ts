import { StepInfo, CharacterState } from '../../../types';

// KMP の失敗関数（prefix table）を計算
function computeLPSArray(pattern: string): number[] {
  const m = pattern.length;
  const lps = new Array(m).fill(0);
  let len = 0;
  let i = 1;

  while (i < m) {
    if (pattern[i] === pattern[len]) {
      len++;
      lps[i] = len;
      i++;
    } else {
      if (len !== 0) {
        len = lps[len - 1];
      } else {
        lps[i] = 0;
        i++;
      }
    }
  }

  return lps;
}

export function* kmpSearch(text: string, pattern: string): Generator<StepInfo> {
  const n = text.length;
  const m = pattern.length;
  let stepNumber = 0;
  const matchPositions: number[] = [];

  // LPS (Longest Proper Prefix which is also Suffix) 配列を計算
  const lps = computeLPSArray(pattern);

  stepNumber++;
  yield {
    stepNumber,
    textIndex: -1,
    patternIndex: -1,
    description: `KMP 前処理: LPS配列 = [${lps.join(', ')}]`,
    textStates: new Array(n).fill('unprocessed'),
    patternStates: new Array(m).fill('unprocessed'),
    isMatch: false,
  };

  let i = 0; // text のインデックス
  let j = 0; // pattern のインデックス

  while (i < n) {
    stepNumber++;

    const textStates: CharacterState[] = new Array(n).fill('unprocessed');
    const patternStates: CharacterState[] = new Array(m).fill('unprocessed');

    // 現在一致している部分
    for (let k = 0; k < j; k++) {
      textStates[i - j + k] = 'matching';
      patternStates[k] = 'matching';
    }

    // 比較中の文字
    if (j < m) {
      textStates[i] = 'comparing';
      patternStates[j] = 'comparing';
    }

    const isMatch = text[i] === pattern[j];

    yield {
      stepNumber,
      textIndex: i,
      patternIndex: j,
      description: `text[${i}] ('${text[i]}') と pattern[${j}] ('${pattern[j]}') を比較 → ${isMatch ? '一致' : '不一致'}`,
      textStates,
      patternStates,
      isMatch,
    };

    if (isMatch) {
      i++;
      j++;
    }

    if (j === m) {
      // パターンが一致
      const foundTextStates: CharacterState[] = new Array(n).fill('unprocessed');
      const foundPatternStates: CharacterState[] = new Array(m).fill('matching');

      const matchPos = i - j;
      for (let k = 0; k < m; k++) {
        foundTextStates[matchPos + k] = 'found';
      }

      matchPositions.push(matchPos);

      stepNumber++;
      yield {
        stepNumber,
        textIndex: matchPos,
        patternIndex: 0,
        description: `位置 ${matchPos} でパターンが一致しました！`,
        textStates: foundTextStates,
        patternStates: foundPatternStates,
        isMatch: true,
      };

      // 次の検索のために LPS を使用してジャンプ
      j = lps[j - 1];

      if (j > 0) {
        stepNumber++;
        yield {
          stepNumber,
          textIndex: i,
          patternIndex: j,
          description: `LPS配列を参照: pattern[${j}] から再開`,
          textStates: foundTextStates,
          patternStates: foundPatternStates,
          isMatch: false,
        };
      }
    } else if (i < n && text[i] !== pattern[j]) {
      // 不一致の場合
      if (j !== 0) {
        const oldJ = j;
        j = lps[j - 1];

        stepNumber++;
        const shiftedTextStates: CharacterState[] = new Array(n).fill('unprocessed');
        const shiftedPatternStates: CharacterState[] = new Array(m).fill('unprocessed');

        shiftedTextStates[i] = 'mismatched';
        shiftedPatternStates[oldJ] = 'mismatched';

        yield {
          stepNumber,
          textIndex: i,
          patternIndex: j,
          description: `不一致: LPS[${oldJ - 1}] = ${j} を参照してジャンプ`,
          textStates: shiftedTextStates,
          patternStates: shiftedPatternStates,
          isMatch: false,
          shiftAmount: oldJ - j,
        };
      } else {
        i++;
      }
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

export const kmpInfo = {
  name: 'クヌース–モリス–プラット法（KMP）',
  description: 'パターンの接頭辞と接尾辞の情報を事前計算し、不一致時に効率的にスキップします。',
  timeComplexity: {
    best: 'O(n)',
    average: 'O(n + m)',
    worst: 'O(n + m)',
  },
  spaceComplexity: 'O(m)',
};
