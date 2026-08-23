const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const taskRoutes = require('./routes/task.routes');
const quizRoutes = require('./routes/quiz.routes');
const submissionRoutes = require('./routes/submission.routes');
const achievementRoutes = require('./routes/achievement.routes');
const leaderboardRoutes = require('./routes/leaderboard.routes');
const adminRoutes = require('./routes/admin.routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

const allowedOrigins = [process.env.CLIENT_URL, 'http://localhost:5173'].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Serves uploaded photo files, e.g. GET /uploads/<filename>.jpg
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/admin', adminRoutes);

// 404 for anything under /api that didn't match a route above.
app.use('/api', (req, res) => res.status(404).json({ error: 'Not found' }));

// Must be registered last - Express calls this for any error passed to next(err).
app.use(errorHandler);

module.exports = app;
