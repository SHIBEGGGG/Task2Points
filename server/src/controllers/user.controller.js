const prisma = require('../config/prisma');
const { calculateLevel } = require('../utils/level');

// Returns everything the profile page needs. Stats (tasksCompleted, rank,
// etc.) are computed on the fly from existing tables rather than stored
// redundantly, so they can never drift out of sync with reality.
async function getProfile(req, res) {
  const userId = Number(req.params.id) || req.user.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      userAchievements: { include: { achievement: true }, orderBy: { unlockedAt: 'desc' } },
    },
  });
  if (!user) return res.status(404).json({ error: 'User not found' });

  const [tasksCompleted, quizCorrect, rank] = await Promise.all([
    prisma.taskCompletion.count({ where: { userId } }),
    prisma.quizAttempt.count({ where: { userId, isCorrect: true } }),
    prisma.user.count({ where: { totalXp: { gt: user.totalXp } } }).then((n) => n + 1),
  ]);

  const recentCompletions = await prisma.taskCompletion.findMany({
    where: { userId },
    include: { task: true },
    orderBy: { completedAt: 'desc' },
    take: 5,
  });

  const { passwordHash, userAchievements, ...safeUser } = user;

  res.json({
    ...safeUser,
    level: calculateLevel(user.totalXp),
    rank,
    tasksCompleted,
    quizCorrect,
    achievements: userAchievements.map((ua) => ({ ...ua.achievement, unlockedAt: ua.unlockedAt })),
    recentCompletions,
  });
}

module.exports = { getProfile };
