const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const requireAuth = require('../middleware/auth');
const { getProfile } = require('../controllers/user.controller');

const router = express.Router();

router.get('/me', requireAuth, asyncHandler(getProfile));
router.get('/:id', requireAuth, asyncHandler(getProfile));

module.exports = router;
