import { DataPattern, DataGeneratorConfig } from '../../../types';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

// ランダムな文字列を生成
export function generateRandomString(length: number): string {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return result;
}

// 反復文字列を生成（パターンが繰り返される）
export function generateRepeatedString(textLength: number, patternLength: number): { text: string; pattern: string } {
  // 短いパターンを生成
  const pattern = generateRandomString(Math.min(patternLength, 3));

  // パターンを繰り返してテキストを作成
  let text = '';
  while (text.length < textLength) {
    text += pattern;
    if (text.length < textLength - 2) {
      text += generateRandomString(Math.floor(Math.random() * 3)); // ノイズを追加
    }
  }

  return {
    text: text.slice(0, textLength),
    pattern: pattern.slice(0, patternLength),
  };
}

// 部分一致が多い文字列を生成
export function generatePartialMatchString(textLength: number, patternLength: number): { text: string; pattern: string } {
  // パターンを生成
  const pattern = generateRandomString(patternLength);

  // パターンの一部を繰り返し含むテキストを生成
  let text = '';
  const partialLength = Math.max(1, Math.floor(patternLength / 2));

  while (text.length < textLength) {
    if (Math.random() < 0.3) {
      // パターンの一部を挿入
      text += pattern.slice(0, partialLength);
    } else if (Math.random() < 0.2) {
      // 完全なパターンを挿入
      text += pattern;
    } else {
      // ランダムな文字を挿入
      text += generateRandomString(1);
    }
  }

  return {
    text: text.slice(0, textLength),
    pattern,
  };
}

// 最悪ケースの文字列を生成（多くの比較が必要）
export function generateWorstCaseString(textLength: number, patternLength: number): { text: string; pattern: string } {
  // すべて同じ文字のテキストを生成（最後だけ異なる）
  const char = 'A';
  const text = char.repeat(textLength - 1) + 'B';

  // パターンもすべて同じ文字（最後だけ異なる）
  const pattern = char.repeat(Math.max(1, patternLength - 1)) + 'B';

  return {
    text,
    pattern: pattern.slice(0, patternLength),
  };
}

// データ生成の設定に基づいて文字列を生成
export function generateData(config: DataGeneratorConfig): { text: string; pattern: string } {
  const { pattern, textLength, patternLength } = config;

  // パターン長がテキスト長より大きい場合は調整
  const adjustedPatternLength = Math.min(patternLength, Math.floor(textLength / 2));

  switch (pattern) {
    case 'repeated':
      return generateRepeatedString(textLength, adjustedPatternLength);

    case 'partial-match':
      return generatePartialMatchString(textLength, adjustedPatternLength);

    case 'worst-case':
      return generateWorstCaseString(textLength, adjustedPatternLength);

    case 'random':
    default:
      return {
        text: generateRandomString(textLength),
        pattern: generateRandomString(adjustedPatternLength),
      };
  }
}

// データパターンの説明
export const dataPatternDescriptions: Record<DataPattern, string> = {
  'random': 'ランダムな英数字の組み合わせ',
  'repeated': 'パターンが繰り返し出現する文字列',
  'partial-match': '部分一致が多く含まれる文字列',
  'worst-case': 'アルゴリズムの最悪ケースとなる文字列（多くの比較が必要）',
};
