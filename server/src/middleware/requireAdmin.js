// Must run AFTER requireAuth, since it relies on req.user being set.
// Blocks any normal user from hitting admin-only routes.
function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}

module.exports = requireAdmin;
