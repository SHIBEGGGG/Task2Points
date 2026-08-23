const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const requireAuth = require('../middleware/auth');
const requireAdmin = require('../middleware/requireAdmin');
const admin = require('../controllers/admin.controller');

const router = express.Router();

// Every route below requires both a valid login AND the ADMIN role.
router.use(requireAuth, requireAdmin);

router.post('/tasks', asyncHandler(admin.createTask));
router.put('/tasks/:id', asyncHandler(admin.updateTask));
router.delete('/tasks/:id', asyncHandler(admin.deleteTask));

router.post('/questions', asyncHandler(admin.createQuestion));
router.put('/questions/:id', asyncHandler(admin.updateQuestion));
router.delete('/questions/:id', asyncHandler(admin.deleteQuestion));

router.get('/submissions', asyncHandler(admin.listPendingSubmissions));
router.put('/submissions/:id/approve', asyncHandler(admin.approveSubmission));
router.put('/submissions/:id/reject', asyncHandler(admin.rejectSubmission));

router.get('/users', asyncHandler(admin.listUsers));
router.get('/stats', asyncHandler(admin.getStats));

module.exports = router;
