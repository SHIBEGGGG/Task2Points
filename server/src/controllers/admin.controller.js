const prisma = require('../config/prisma');
const { grantXpForTaskCompletion, AlreadyCompletedError } = require('../services/xp.service');

// --- Task management ---

async function createTask(req, res) {
  const { type, title, description, category, xpValue } = req.body;
  if (!type || !title || !xpValue) {
    return res.status(400).json({ error: 'type, title, and xpValue are required' });
  }
  if (!['QUIZ', 'PHOTO'].includes(type)) {
    return res.status(400).json({ error: "type must be 'QUIZ' or 'PHOTO'" });
  }

  const task = await prisma.task.create({
    data: { type, title, description, category, xpValue: Number(xpValue) },
  });
  res.status(201).json(task);
}

async function updateTask(req, res) {
  const id = Number(req.params.id);
  const { title, description, category, xpValue, isActive } = req.body;

  const task = await prisma.task.update({
    where: { id },
    data: {
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(category !== undefined && { category }),
      ...(xpValue !== undefined && { xpValue: Number(xpValue) }),
      ...(isActive !== undefined && { isActive }),
    },
  });
  res.json(task);
}

async function deleteTask(req, res) {
  const id = Number(req.params.id);
  // Soft-delete via isActive is usually safer than a hard delete, since
  // TaskCompletion/XpTransaction rows reference this task's history.
  // If you do want a hard delete, uncomment the line below instead -
  // the schema's onDelete: Cascade will clean up dependent rows.
  // await prisma.task.delete({ where: { id } });
  await prisma.task.update({ where: { id }, data: { isActive: false } });
  res.json({ message: 'Task deactivated' });
}

// --- Quiz question management ---

async function createQuestion(req, res) {
  const { taskId, question, correctAnswer, options } = req.body;
  if (!taskId || !question || !correctAnswer || !Array.isArray(options)) {
    return res.status(400).json({ error: 'taskId, question, correctAnswer, and options[] are required' });
  }

  const created = await prisma.quizQuestion.create({
    data: { taskId: Number(taskId), question, correctAnswer, options },
  });
  res.status(201).json(created);
}

async function updateQuestion(req, res) {
  const id = Number(req.params.id);
  const { question, correctAnswer, options } = req.body;

  const updated = await prisma.quizQuestion.update({
    where: { id },
    data: {
      ...(question !== undefined && { question }),
      ...(correctAnswer !== undefined && { correctAnswer }),
      ...(options !== undefined && { options }),
    },
  });
  res.json(updated);
}

async function deleteQuestion(req, res) {
  const id = Number(req.params.id);
  await prisma.quizQuestion.delete({ where: { id } });
  res.json({ message: 'Question deleted' });
}

// --- Submission review ---

async function listPendingSubmissions(req, res) {
  const submissions = await prisma.photoSubmission.findMany({
    where: { status: 'PENDING' },
    include: { user: { select: { id: true, username: true } }, task: true },
    orderBy: { submittedAt: 'asc' },
  });
  res.json(submissions);
}

async function approveSubmission(req, res) {
  const id = Number(req.params.id);

  const submission = await prisma.photoSubmission.findUnique({ where: { id } });
  if (!submission) return res.status(404).json({ error: 'Submission not found' });
  if (submission.status !== 'PENDING') {
    return res.status(409).json({ error: `Submission already ${submission.status.toLowerCase()}` });
  }

  try {
    const result = await grantXpForTaskCompletion(
      submission.userId,
      submission.taskId,
      `photo_approved:${submission.taskId}`
    );

    const updated = await prisma.photoSubmission.update({
      where: { id },
      data: { status: 'APPROVED', reviewedById: req.user.id, reviewedAt: new Date() },
    });

    res.json({ submission: updated, ...result });
  } catch (err) {
    if (err instanceof AlreadyCompletedError) {
      // Edge case: user somehow already has a completion for this task
      // (e.g. two pending submissions approved back to back). Mark this
      // submission approved for record-keeping but don't double-grant XP.
      const updated = await prisma.photoSubmission.update({
        where: { id },
        data: { status: 'APPROVED', reviewedById: req.user.id, reviewedAt: new Date() },
      });
      return res.json({ submission: updated, xpAwarded: 0, alreadyCompleted: true });
    }
    throw err;
  }
}

async function rejectSubmission(req, res) {
  const id = Number(req.params.id);

  const submission = await prisma.photoSubmission.findUnique({ where: { id } });
  if (!submission) return res.status(404).json({ error: 'Submission not found' });
  if (submission.status !== 'PENDING') {
    return res.status(409).json({ error: `Submission already ${submission.status.toLowerCase()}` });
  }

  const updated = await prisma.photoSubmission.update({
    where: { id },
    data: { status: 'REJECTED', reviewedById: req.user.id, reviewedAt: new Date() },
  });
  res.json(updated);
}

// --- Users & stats ---

async function listUsers(req, res) {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      totalXp: true,
      createdAt: true,
      _count: { select: { taskCompletions: true } },
    },
  });
  res.json(users);
}

async function getStats(req, res) {
  const [userCount, taskCount, pendingSubmissions, totalCompletions] = await Promise.all([
    prisma.user.count(),
    prisma.task.count({ where: { isActive: true } }),
    prisma.photoSubmission.count({ where: { status: 'PENDING' } }),
    prisma.taskCompletion.count(),
  ]);
  res.json({ userCount, taskCount, pendingSubmissions, totalCompletions });
}

module.exports = {
  createTask,
  updateTask,
  deleteTask,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  listPendingSubmissions,
  approveSubmission,
  rejectSubmission,
  listUsers,
  getStats,
};
