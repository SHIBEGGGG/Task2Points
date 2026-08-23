const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const requireAuth = require('../middleware/auth');
const { listTasks, getTodaysTasks } = require('../controllers/task.controller');

const router = express.Router();

router.get('/', requireAuth, asyncHandler(listTasks));
router.get('/today', requireAuth, asyncHandler(getTodaysTasks));

module.exports = router;
