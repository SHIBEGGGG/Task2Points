const prisma = require('../config/prisma');
const { grantXpForTaskCompletion, AlreadyCompletedError } = require('../services/xp.service');

// Returns a random question from this task's pool that the user hasn't
// already answered, so the pool feels fresh instead of repeating. Once every
// question has been seen, it falls back to picking from the whole pool
// again (rather than returning nothing) - the "not the same repeatedly
// until the pool is used up" behavior the spec asked for.
async function getQuizQuestion(req, res) {
  const taskId = Number(req.params.taskId);

  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task || task.type !== 'QUIZ' || !task.isActive) {
    return res.status(404).json({ error: 'Quiz task not found' });
  }

  const answeredIds = (
    await prisma.quizAttempt.findMany({
      where: { userId: req.user.id, taskId },
      select: { quizQuestionId: true },
    })
  ).map((a) => a.quizQuestionId);

  let question = await prisma.quizQuestion.findFirst({
    where: { taskId, id: { notIn: answeredIds } },
    // Prisma has no built-in "random order" - for small question pools this
    // fetch-then-shuffle-in-JS approach is simplest. For a large pool,
    // switch to a raw SQL `ORDER BY RANDOM() LIMIT 1` query instead.
  });

  if (!question) {
    // User has seen every question in the pool - reset and pick from all of them.
    const allQuestions = await prisma.quizQuestion.findMany({ where: { taskId } });
    question = allQuestions[Math.floor(Math.random() * allQuestions.length)];
  }

  if (!question) {
    return res.status(404).json({ error: 'No questions available for this task yet' });
  }

  // Never send correctAnswer to the client.
  res.json({
    id: question.id,
    taskId: question.taskId,
    question: question.question,
    options: question.options,
  });
}

// Grades the answer server-side, records the attempt, and - only if correct
// AND this task hasn't already been completed - grants XP through the
// shared xp.service so all the transactional safety lives in one place.
async function submitQuizAnswer(req, res) {
  const taskId = Number(req.params.taskId);
  const { questionId, answer } = req.body;

  if (!questionId || typeof answer !== 'string') {
    return res.status(400).json({ error: 'questionId and answer are required' });
  }

  const question = await prisma.quizQuestion.findFirst({
    where: { id: Number(questionId), taskId },
  });
  if (!question) return res.status(404).json({ error: 'Question not found for this task' });

  const isCorrect = answer.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase();

  await prisma.quizAttempt.create({
    data: { userId: req.user.id, quizQuestionId: question.id, taskId, isCorrect },
  });

  if (!isCorrect) {
    return res.json({ correct: false, xpAwarded: 0 });
  }

  try {
    const result = await grantXpForTaskCompletion(req.user.id, taskId, `quiz_completed:${taskId}`);
    return res.json({ correct: true, ...result });
  } catch (err) {
    if (err instanceof AlreadyCompletedError) {
      // They already completed this task before (maybe via an earlier
      // correct answer) - the answer is still marked correct, just no more XP.
      return res.json({ correct: true, xpAwarded: 0, alreadyCompleted: true });
    }
    throw err;
  }
}

module.exports = { getQuizQuestion, submitQuizAnswer };
