import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <div className="level-badge mx-auto mb-3 text-2xl">⚔️</div>
          <h1 className="text-3xl text-gold">Quest Log</h1>
          <p className="font-mono text-xs text-parchment/50 mt-1">RESUME YOUR PROGRESS</p>
        </div>

        <form onSubmit={handleSubmit} className="panel space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-primary w-full" disabled={submitting}>
            {submitting ? 'Logging in…' : 'Log In'}
          </button>
          {error && <p className="text-coral text-sm text-center">{error}</p>}
        </form>

        <p className="text-center text-sm text-parchment/60 mt-6">
          No account yet?{' '}
          <Link to="/register" className="text-gold hover:underline">
            Start your quest
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
