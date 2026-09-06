const prisma = require('../config/prisma');

async function checkAndUnlockAchievements(tx, userId) {
  const [user, tasksCompletedCount, quizCorrectCount, alreadyUnlocked, allAchievements] =
    await Promise.all([
      tx.user.findUnique({ where: { id: userId } }),
      tx.taskCompletion.count({ where: { userId } }),
      tx.quizAttempt.count({ where: { userId, isCorrect: true } }),
      tx.userAchievement.findMany({ where: { userId }, select: { achievementId: true } }),
      tx.achievement.findMany(),
    ]);

  const unlockedIds = new Set(alreadyUnlocked.map((a) => a.achievementId));
  const newlyUnlocked = [];

  for (const achievement of allAchievements) {
    if (unlockedIds.has(achievement.id)) continue;

    const condition = achievement.unlockCondition;
    const current = statFor(condition.type, { user, tasksCompletedCount, quizCorrectCount });

    if (current !== null && current >= condition.value) {
      newlyUnlocked.push(achievement);
    }
  }

  if (newlyUnlocked.length > 0) {
    await tx.userAchievement.createMany({
      data: newlyUnlocked.map((a) => ({ userId, achievementId: a.id })),
      skipDuplicates: true,
    });
  }

  return newlyUnlocked;
}

function statFor(type, { user, tasksCompletedCount, quizCorrectCount }) {
  switch (type) {
    case 'xp':
      return user.totalXp;
    case 'tasksCompleted':
      return tasksCompletedCount;
    case 'quizCorrect':
      return quizCorrectCount;
    case 'streak':
      return user.currentStreak;
    default:
      return null;
  }
}

module.exports = { checkAndUnlockAchievements };