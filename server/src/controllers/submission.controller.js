const prisma = require('../config/prisma');
const { startOfTodayUTC } = require('../services/xp.service');

async function submitPhoto(req, res) {
  const taskId = Number(req.body.taskId);
  if (!taskId) return res.status(400).json({ error: 'taskId is required' });
  if (!req.file) return res.status(400).json({ error: 'A photo file is required' });

  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task || task.type !== 'PHOTO' || !task.isActive) {
    return res.status(404).json({ error: 'Photo task not found' });
  }

  const alreadyCompletedToday = await prisma.taskCompletion.findUnique({
    where: {
      userId_taskId_completionDate: { userId: req.user.id, taskId, completionDate: startOfTodayUTC() },
    },
  });
  if (alreadyCompletedToday) {
    return res.status(409).json({ error: 'You have already completed this task today' });
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

async function myMedia(req, res) {
  const submissions = await prisma.photoSubmission.findMany({
    where: { userId: req.user.id },
    include: { task: true },
    orderBy: { submittedAt: 'desc' },
  });
  res.json(submissions);
}

module.exports = { submitPhoto, myMedia };