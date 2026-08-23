const prisma = require('../config/prisma');

// All currently active tasks, with whether the current user has already
// completed each one (so the frontend can grey out finished ones).
async function listTasks(req, res) {
  const tasks = await prisma.task.findMany({
    where: { isActive: true },
    orderBy: { id: 'asc' },
  });

  const completions = await prisma.taskCompletion.findMany({
    where: { userId: req.user.id },
    select: { taskId: true },
  });
  const completedIds = new Set(completions.map((c) => c.taskId));

  res.json(
    tasks.map((t) => ({ ...t, isCompleted: completedIds.has(t.id) }))
  );
}

// For the MVP, "today's tasks" = active tasks not yet completed. Once you
// add daily resets, this is the place to filter by a completedAt date range
// instead of the current all-time TaskCompletion uniqueness.
async function getTodaysTasks(req, res) {
  const completions = await prisma.taskCompletion.findMany({
    where: { userId: req.user.id },
    select: { taskId: true },
  });
  const completedIds = completions.map((c) => c.taskId);

  const tasks = await prisma.task.findMany({
    where: { isActive: true, id: { notIn: completedIds } },
    orderBy: { id: 'asc' },
  });

  res.json(tasks);
}

module.exports = { listTasks, getTodaysTasks };
