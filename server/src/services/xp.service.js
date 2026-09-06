const prisma = require('../config/prisma');
const { checkAndUnlockAchievements } = require('./achievement.service');

class AlreadyCompletedError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AlreadyCompletedError';
    this.status = 409;
  }
}

function startOfTodayUTC() {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

function daysBetween(a, b) {
  return Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
}

async function updateStreak(tx, userId, today) {
  const user = await tx.user.findUnique({ where: { id: userId } });

  let newStreak = user.currentStreak;
  if (!user.lastCompletionDate) {
    newStreak = 1;
  } else {
    const gap = daysBetween(user.lastCompletionDate, today);
    if (gap === 0) {
      newStreak = user.currentStreak;
    } else if (gap === 1) {
      newStreak = user.currentStreak + 1;
    } else {
      newStreak = 1;
    }
  }

  await tx.user.update({
    where: { id: userId },
    data: {
      currentStreak: newStreak,
      longestStreak: Math.max(newStreak, user.longestStreak),
      lastCompletionDate: today,
    },
  });
}

async function grantXpForTaskCompletion(userId, taskId, reason) {
  const completionDate = startOfTodayUTC();

  return prisma.$transaction(async (tx) => {
    const task = await tx.task.findUnique({ where: { id: taskId } });
    if (!task || !task.isActive) {
      const err = new Error('Task not found or no longer available');
      err.status = 404;
      throw err;
    }

    try {
      await tx.taskCompletion.create({
        data: { userId, taskId, xpAwarded: task.xpValue, completionDate },
      });
    } catch (err) {
      if (err.code === 'P2002') {
        throw new AlreadyCompletedError('You have already completed this task today');
      }
      throw err;
    }

    await tx.xpTransaction.create({
      data: { userId, amount: task.xpValue, reason: reason || `task_completed:${taskId}` },
    });

    await updateStreak(tx, userId, completionDate);

    const updatedUser = await tx.user.update({
      where: { id: userId },
      data: { totalXp: { increment: task.xpValue } },
    });

    const newlyUnlocked = await checkAndUnlockAchievements(tx, userId);

    return { xpAwarded: task.xpValue, totalXp: updatedUser.totalXp, newlyUnlocked };
  });
}

module.exports = { grantXpForTaskCompletion, AlreadyCompletedError, startOfTodayUTC };