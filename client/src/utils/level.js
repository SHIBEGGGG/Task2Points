function xpForLevel(level) {
  if (level <= 1) return 0;
  return Math.round(100 * Math.pow(level - 1, 1.5));
}

export function calculateLevel(totalXp) {
  let level = 1;
  while (xpForLevel(level + 1) <= totalXp && level < 1000) {
    level += 1;
  }
  return level;
}