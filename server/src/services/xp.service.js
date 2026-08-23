const prisma = require('../config/prisma');
const { checkAndUnlockAchievements } = require('./achievement.service');

// Custom error so controllers can tell "already completed" apart from a
// generic 500 and return a proper 409 to the frontend.
class AlreadyCompletedError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AlreadyCompletedError';
    this.status = 409;
  }
}

// The ONLY function in the app that is allowed to grant XP for completing a
// task. It always looks up the XP value from the Task row in the database -
// it never trusts a value from the request body. Everything happens inside
// a single database transaction so a completion record, XP transaction, and
// updated total either all succeed or all roll back together.
//
// The @@unique([userId, taskId]) constraint on TaskCompletion is what
// actually prevents double-completion even under concurrent requests -
// Postgres itself rejects the second insert, so this is safe against race
// conditions, not just a JS-level check.
async function grantXpForTaskCompletion(userId, taskId, reason) {
  return prisma.$transaction(async (tx) => {
    const task = await tx.task.findUnique({ where: { id: taskId } });
    if (!task || !task.isActive) {
      const err = new Error('Task not found or no longer available');
      err.status = 404;
      throw err;
    }

    try {
      await tx.taskCompletion.create({
        data: { userId, taskId, xpAwarded: task.xpValue },
      });
    } catch (err) {
      // Prisma unique constraint violation code
      if (err.code === 'P2002') {
        throw new AlreadyCompletedError('You have already completed this task');
      }
      throw err;
    }

    await tx.xpTransaction.create({
      data: { userId, amount: task.xpValue, reason: reason || `task_completed:${taskId}` },
    });

    const updatedUser = await tx.user.update({
      where: { id: userId },
      data: { totalXp: { increment: task.xpValue } },
    });

    const newlyUnlocked = await checkAndUnlockAchievements(tx, userId);

    return { xpAwarded: task.xpValue, totalXp: updatedUser.totalXp, newlyUnlocked };
  });
}

module.exports = { grantXpForTaskCompletion, AlreadyCompletedError };
