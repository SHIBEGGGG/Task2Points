const prisma = require('../config/prisma');

// Returns every achievement with locked/unlocked state for the current
// user, so the frontend can render both states from one call.
async function listAchievements(req, res) {
  const [all, unlocked] = await Promise.all([
    prisma.achievement.findMany({ orderBy: { id: 'asc' } }),
    prisma.userAchievement.findMany({ where: { userId: req.user.id } }),
  ]);

  const unlockedMap = new Map(unlocked.map((u) => [u.achievementId, u.unlockedAt]));

  res.json(
    all.map((a) => ({
      ...a,
      unlocked: unlockedMap.has(a.id),
      unlockedAt: unlockedMap.get(a.id) || null,
    }))
  );
}

module.exports = { listAchievements };
