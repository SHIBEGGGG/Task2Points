import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

// Wrap any page element that requires login:
// <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return null; // or a loading spinner, once you build the UI
  if (!user) return <Navigate to="/login" replace />;

  return children;
}

// Wrap admin-only pages the same way:
// <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
export function AdminRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'ADMIN') return <Navigate to="/dashboard" replace />;

  return children;
}
