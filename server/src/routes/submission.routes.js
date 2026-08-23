const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const requireAuth = require('../middleware/auth');
const upload = require('../middleware/upload');
const { submitPhoto, myMedia } = require('../controllers/submission.controller');

const router = express.Router();

router.post('/photo', requireAuth, upload.single('photo'), asyncHandler(submitPhoto));
router.get('/mine', requireAuth, asyncHandler(myMedia));

module.exports = router;
