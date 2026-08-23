const prisma = require('../config/prisma');

// All-time leaderboard just reads totalXp directly off the User table -
// it's kept accurate by the xp.service transaction on every completion.
async function getAllTimeLeaderboard(req, res) {
  const limit = Math.min(Number(req.query.limit) || 50, 100);

  const users = await prisma.user.findMany({
    orderBy: { totalXp: 'desc' },
    take: limit,
    select: {
      id: true,
      username: true,
      avatarUrl: true,
      totalXp: true,
      _count: { select: { taskCompletions: true, userAchievements: true } },
    },
  });

  res.json(
    users.map((u, index) => ({
      rank: index + 1,
      id: u.id,
      username: u.username,
      avatarUrl: u.avatarUrl,
      totalXp: u.totalXp,
      tasksCompleted: u._count.taskCompletions,
      achievementCount: u._count.userAchievements,
    }))
  );
}

// Weekly leaderboard sums XpTransaction rows from the last 7 days instead of
// reading totalXp, since totalXp is an all-time figure. This is why we keep
// XpTransaction as an append-only ledger rather than just incrementing a counter.
async function getWeeklyLeaderboard(req, res) {
  const limit = Math.min(Number(req.query.limit) || 50, 100);
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const grouped = await prisma.xpTransaction.groupBy({
    by: ['userId'],
    where: { createdAt: { gte: weekAgo } },
    _sum: { amount: true },
    orderBy: { _sum: { amount: 'desc' } },
    take: limit,
  });

  const users = await prisma.user.findMany({
    where: { id: { in: grouped.map((g) => g.userId) } },
    select: { id: true, username: true, avatarUrl: true },
  });
  const userMap = new Map(users.map((u) => [u.id, u]));

  res.json(
    grouped.map((g, index) => ({
      rank: index + 1,
      id: g.userId,
      username: userMap.get(g.userId)?.username,
      avatarUrl: userMap.get(g.userId)?.avatarUrl,
      weeklyXp: g._sum.amount,
    }))
  );
}

module.exports = { getAllTimeLeaderboard, getWeeklyLeaderboard };
