const express = require('express');
const rateLimit = require('express-rate-limit');
const asyncHandler = require('../utils/asyncHandler');
const requireAuth = require('../middleware/auth');
const { register, login, logout, me } = require('../controllers/auth.controller');

const router = express.Router();

// Slows down brute-force password guessing without needing a captcha.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  message: { error: 'Too many login attempts. Try again later.' },
});

router.post('/register', asyncHandler(register));
router.post('/login', loginLimiter, asyncHandler(login));
router.post('/logout', logout);
router.get('/me', requireAuth, me);

module.exports = router;
