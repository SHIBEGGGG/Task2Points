const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const requireAuth = require('../middleware/auth');
const { getQuizQuestion, submitQuizAnswer } = require('../controllers/quiz.controller');

const router = express.Router();

router.get('/:taskId/question', requireAuth, asyncHandler(getQuizQuestion));
router.post('/:taskId/submit', requireAuth, asyncHandler(submitQuizAnswer));

module.exports = router;
