const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const requireAuth = require('../middleware/auth');
const { getAllTimeLeaderboard, getWeeklyLeaderboard } = require('../controllers/leaderboard.controller');

const router = express.Router();

router.get('/', requireAuth, asyncHandler(getAllTimeLeaderboard));
router.get('/weekly', requireAuth, asyncHandler(getWeeklyLeaderboard));

module.exports = router;
