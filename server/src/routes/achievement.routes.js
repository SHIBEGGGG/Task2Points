const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const requireAuth = require('../middleware/auth');
const { listAchievements } = require('../controllers/achievement.controller');

const router = express.Router();

router.get('/', requireAuth, asyncHandler(listAchievements));

module.exports = router;
