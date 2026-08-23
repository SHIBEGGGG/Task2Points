const prisma = require('../config/prisma');

// Creates a PENDING PhotoSubmission. No XP is granted here - that only
// happens if/when an admin approves it (see admin.controller.js). Blocks a
// duplicate pending submission for the same task so a user can't spam the
// review queue while waiting on an existing one.
async function submitPhoto(req, res) {
  const taskId = Number(req.body.taskId);
  if (!taskId) return res.status(400).json({ error: 'taskId is required' });
  if (!req.file) return res.status(400).json({ error: 'A photo file is required' });

  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task || task.type !== 'PHOTO' || !task.isActive) {
    return res.status(404).json({ error: 'Photo task not found' });
  }

  const alreadyCompleted = await prisma.taskCompletion.findUnique({
    where: { userId_taskId: { userId: req.user.id, taskId } },
  });
  if (alreadyCompleted) {
    return res.status(409).json({ error: 'You have already completed this task' });
  }

  const existingPending = await prisma.photoSubmission.findFirst({
    where: { userId: req.user.id, taskId, status: 'PENDING' },
  });
  if (existingPending) {
    return res.status(409).json({ error: 'You already have a pending submission for this task' });
  }

  const submission = await prisma.photoSubmission.create({
    data: {
      userId: req.user.id,
      taskId,
      photoUrl: `/uploads/${req.file.filename}`,
      status: 'PENDING',
    },
  });

  res.status(201).json(submission);
}

// A user's own submission history, so they can see what's pending/approved/rejected.
async function myMedia(req, res) {
  const submissions = await prisma.photoSubmission.findMany({
    where: { userId: req.user.id },
    include: { task: true },
    orderBy: { submittedAt: 'desc' },
  });
  res.json(submissions);
}

module.exports = { submitPhoto, myMedia };
