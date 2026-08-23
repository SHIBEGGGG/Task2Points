import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';

const NAV_LINKS = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/tasks', label: 'Quests' },
  { to: '/leaderboard', label: 'Leaderboard' },
  { to: '/achievements', label: 'Achievements' },
  { to: '/profile', label: 'Profile' },
];

// A fixed top HUD bar, the way a game keeps your stats visible no matter
// where you are in the menus. The active link gets a gold underline instead
// of a background swap, keeping the bar visually quiet.
export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  return (
    <div className="min-h-screen">
      <nav className="sticky top-0 z-40 bg-ink-panel/90 backdrop-blur border-b border-white/5">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `relative px-3 py-2 text-sm font-semibold tracking-wide transition-colors ${
                    isActive ? 'text-gold' : 'text-parchment/70 hover:text-parchment'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {link.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute left-3 right-3 -bottom-[13px] h-0.5 bg-gold"
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
            {user?.role === 'ADMIN' && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `px-3 py-2 text-sm font-semibold tracking-wide ${
                    isActive ? 'text-coral' : 'text-coral/70 hover:text-coral'
                  }`
                }
              >
                Admin
              </NavLink>
            )}
          </div>

          {user && (
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-parchment/60 hidden sm:inline">{user.username}</span>
              <button onClick={handleLogout} className="btn btn-secondary !py-1.5 !px-3 text-xs">
                Log Out
              </button>
            </div>
          )}
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
