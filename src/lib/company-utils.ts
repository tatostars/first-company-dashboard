/**
 * 公司数据相关公共工具：
 * - 统一处理 level 值（CSV 中常见 1/2/3，与页面显示 A/B/C 对齐）
 * - 统一数字格式化，避免页面重复定义
 */
export const LEVEL_CODE_TO_LABEL = {
  '1': 'A',
  '2': 'B',
  '3': 'C',
} as const;

export type LevelLabel = 'A' | 'B' | 'C';

export function normalizeLevel(level: string): string {
  return LEVEL_CODE_TO_LABEL[level as keyof typeof LEVEL_CODE_TO_LABEL] ?? level;
}

export function isLevelLabel(level: string): level is LevelLabel {
  return level === 'A' || level === 'B' || level === 'C';
}

export function toLevelStats(levels: string[]): Record<LevelLabel, number> {
  const stats: Record<LevelLabel, number> = { A: 0, B: 0, C: 0 };

  levels.forEach((rawLevel) => {
    const normalized = normalizeLevel(rawLevel);
    if (isLevelLabel(normalized)) {
      stats[normalized] += 1;
    }
  });

  return stats;
}

export function formatCompactNumber(num: number): string {
  if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(2)}B`;
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(2)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(2)}K`;
  return num.toString();
}
