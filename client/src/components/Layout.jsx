import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

// A bare-bones nav shell so every page has a way to get around and log out
// while you're testing. Replace this entirely once you build the real UI -
// nothing else depends on its markup.
export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  return (
    <div>
      <nav>
        <Link to="/dashboard">Dashboard</Link> | <Link to="/tasks">Tasks</Link> |{' '}
        <Link to="/leaderboard">Leaderboard</Link> | <Link to="/achievements">Achievements</Link> |{' '}
        <Link to="/profile">Profile</Link>
        {user?.role === 'ADMIN' && (
          <>
            {' '}
            | <Link to="/admin">Admin</Link>
          </>
        )}
        {user && (
          <>
            {' '}
            | <span>{user.username}</span> | <button onClick={handleLogout}>Log Out</button>
          </>
        )}
      </nav>
      <main>{children}</main>
    </div>
  );
}
