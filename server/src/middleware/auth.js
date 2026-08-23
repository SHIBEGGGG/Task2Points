const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');

// Reads the JWT from the httpOnly cookie set at login, verifies it, and
// loads the corresponding user onto req.user. Rejects with 401 if missing
// or invalid. Using an httpOnly cookie (rather than localStorage) means
// client-side JS can never read or tamper with the token.
async function requireAuth(req, res, next) {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (!user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    // Never attach passwordHash to req.user - it gets sent back in
    // responses far too easily otherwise.
    const { passwordHash, ...safeUser } = user;
    req.user = safeUser;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired session' });
  }
}

module.exports = requireAuth;
