// XP required for a given level follows: xpForLevel(n) = 100 * (n-1)^1.5, rounded.
// Level 1 = 0 XP, Level 2 = 100 XP, Level 3 ≈ 283 XP, Level 4 ≈ 520 XP, Level 5 = 1000 XP, ...
// This gives a smooth curve instead of hard-coding a fixed table, per the
// "reasonable XP curve" requirement - tweak the exponent/multiplier to retune it.

function xpForLevel(level) {
  if (level <= 1) return 0;
  return Math.round(100 * Math.pow(level - 1, 1.5));
}

// Given a user's total XP, returns their current level, XP into the current
// level, and XP required to reach the next level - everything the dashboard
// progress bar needs.
function calculateLevel(totalXp) {
  let level = 1;
  // Cap the search so a corrupted/huge XP value can't loop forever.
  while (xpForLevel(level + 1) <= totalXp && level < 1000) {
    level += 1;
  }

  const currentLevelXp = xpForLevel(level);
  const nextLevelXp = xpForLevel(level + 1);

  return {
    level,
    currentXp: totalXp,
    xpIntoLevel: totalXp - currentLevelXp,
    xpForNextLevel: nextLevelXp - currentLevelXp,
    xpToNextLevel: nextLevelXp - totalXp,
    progressPercent: Math.min(
      100,
      Math.round(((totalXp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100)
    ),
  };
}

module.exports = { xpForLevel, calculateLevel };
