# Gamified Daily Tasks

Full-stack task/quiz app with XP, levels, achievements, a leaderboard, and
admin-reviewed photo submissions.

**Stack:** React + Vite + Tailwind (client) · Node.js + Express (server) ·
PostgreSQL + Prisma (database) · JWT in an httpOnly cookie (auth)

This is the **base**: working backend + a functional-but-unstyled frontend.
All pages fetch real data from the real API - there's just no visual design
applied yet. That's the part left for you.

## Prerequisites

- Node.js 18+ and npm (`node -v` / `npm -v` to check)
- PostgreSQL running locally, or a connection string from a hosted instance
  (e.g. Supabase, Neon, Railway all have free tiers if you don't want to
  install Postgres locally)

## 1. Set up the database

1. Create a database, e.g. `createdb gamified_tasks` (or use your Postgres GUI of choice)
2. In `server/`, copy the env file:
   ```
   cd server
   copy .env.example .env      (Windows)
   cp .env.example .env         (Mac/Linux)
   ```
3. Edit `server/.env` and set `DATABASE_URL` to your real connection string,
   and `JWT_SECRET` to a random string (the .env.example comment shows a
   one-liner to generate one).

## 2. Install and run the backend

```
cd server
npm install
npm run prisma:generate
npm run prisma:migrate      -- creates all the tables, will prompt for a migration name
npm run seed                -- loads sample tasks, quiz questions, and an admin account
npm run dev
```

The server starts on `http://localhost:4000`. Check `http://localhost:4000/api/health`
in a browser - it should return `{"status":"ok"}`.

**Seeded admin login:** `admin@example.com` / `Admin123!` (change this password once you can log in).

## 3. Install and run the frontend

In a second terminal:

```
cd client
copy .env.example .env      (Windows)
cp .env.example .env         (Mac/Linux)
npm install
npm run dev
```

Visit `http://localhost:5173`. Register a new account, or log in as the seeded admin.

## Project structure

```
gamified-tasks/
├── server/
│   ├── prisma/
│   │   ├── schema.prisma      <- full data model, every table commented
│   │   └── seed.js             <- sample tasks/questions/achievements + admin user
│   └── src/
│       ├── server.js            <- entry point
│       ├── app.js                <- Express app, middleware, route mounting
│       ├── config/prisma.js       <- shared Prisma client
│       ├── middleware/             <- auth guard, admin guard, upload validation, error handler
│       ├── controllers/             <- one file per resource, all the business logic
│       ├── routes/                   <- one file per resource, just wires up controllers
│       ├── services/
│       │   ├── xp.service.js           <- the ONLY place XP is ever granted (transactional)
│       │   └── achievement.service.js   <- checks/unlocks achievements after XP changes
│       └── uploads/                      <- uploaded photo submissions land here
└── client/
    └── src/
        ├── main.jsx           <- entry point, wraps app in Router + AuthProvider
        ├── App.jsx              <- all route definitions
        ├── context/AuthContext.jsx  <- tracks logged-in user, login/register/logout
        ├── services/api.js           <- axios instance (sends the auth cookie)
        ├── components/
        │   ├── Layout.jsx               <- bare nav shell, replace freely
        │   ├── ProtectedRoute.jsx        <- route guards (logged-in / admin-only)
        │   ├── QuizWidget.jsx             <- fetch-question + submit-answer flow
        │   └── PhotoUploadWidget.jsx       <- file picker + upload flow
        └── pages/               <- Login, Register, Dashboard, Tasks, Leaderboard,
                                     Achievements, Profile, AdminDashboard
```

## How the important logic works

- **XP is never trusted from the frontend.** Every XP grant goes through
  `xp.service.js`, which looks up the task's `xpValue` from the database and
  runs the completion record + XP transaction + total update inside one
  Prisma transaction.
- **Duplicate completions are blocked at the database level** via a
  `@@unique([userId, taskId])` constraint on `TaskCompletion` - this is what
  actually protects against two simultaneous requests both granting XP, not
  just a check in JavaScript.
- **Quiz questions avoid repeats** by excluding question IDs the user has
  already answered (tracked in `QuizAttempt`); once the whole pool is used,
  it resets and picks from all questions again.
- **Photo tasks never auto-grant XP.** A submission sits `PENDING` until an
  admin calls the approve endpoint, which is what actually triggers the XP
  grant.
- **Achievements use a flexible JSON condition** (`{"type":"xp","value":1000}`
  etc.) so you can add new achievements from the database/seed file without
  touching the achievement-checking code, as long as the condition type is
  one of `xp`, `tasksCompleted`, or `quizCorrect`. Add a new `case` in
  `achievement.service.js` to support a new condition type.
- **Passwords are hashed with bcrypt**, never stored plain. The JWT lives in
  an httpOnly cookie so client-side JS (and therefore XSS) can't read it.

## What's intentionally left for you

- **All visual design.** Every page and component here is unstyled/minimal -
  Tailwind is wired up and ready, but no classes have been applied.
- **Admin forms for creating tasks/questions.** The API endpoints exist
  (`POST /api/admin/tasks`, `POST /api/admin/questions`, etc.) but there's no
  UI for them yet - use `npm run prisma:studio` (from `server/`) as a GUI to
  add data in the meantime, or build the forms once you get to that stage.
- **Levels/streaks visuals, animations, weekly leaderboard UI polish** - the
  backend for levels and the weekly leaderboard is done; only the display is
  pending.

## Testing the important edge cases

A few of the tricky scenarios from the spec, and how to try them:

- **Duplicate completion:** answer the same quiz task correctly twice (or
  call the API directly) - the second attempt returns `alreadyCompleted: true`
  with `xpAwarded: 0`.
- **Fake XP:** there is no endpoint that accepts an XP value from the client
  at all - it's structurally impossible to send `{"xp": 100000}` and have it
  accepted.
- **Invalid photo:** try uploading a `.pdf` or a 10MB image - both are
  rejected by `multer`'s file filter / size limit before ever touching the database.
- **Admin access as a normal user:** log in as a non-admin and hit any
  `/api/admin/*` route - you'll get a 403.
