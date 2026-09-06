import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import Layout from '../components/Layout.jsx';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewingId, setReviewingId] = useState(null);
  const [error, setError] = useState('');

  async function loadAll() {
    setLoading(true);
    setError('');
    try {
      const [statsRes, pendingRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/submissions'),
      ]);
      setStats(statsRes.data);
      setPending(pendingRes.data);
    } catch (err) {
      setError('Could not load the admin console. Try refreshing.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  async function review(id, decision) {
    setReviewingId(id);
    await api.put(`/admin/submissions/${id}/${decision}`);
    await loadAll();
    setReviewingId(null);
  }

  if (error) {
    return (
      <Layout>
        <p className="text-coral">{error}</p>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout>
        <p className="font-mono text-parchment/50">Loading admin console…</p>
      </Layout>
    );
  }

  const apiBase = (import.meta.env.VITE_API_URL || 'http://localhost:4000/api').replace('/api', '');

  return (
    <Layout>
      <h1 className="text-2xl mb-6">Admin Console</h1>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
        {[
          { label: 'Users', value: stats.userCount },
          { label: 'Active Quests', value: stats.taskCount },
          { label: 'Pending', value: stats.pendingSubmissions },
          { label: 'Completions', value: stats.totalCompletions },
        ].map((s) => (
          <div key={s.label} className="panel text-center">
            <p className="font-display text-2xl text-gold">{s.value}</p>
            <p className="font-mono text-[10px] text-parchment/50 uppercase tracking-widest mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <h2 className="text-xl mb-3">Review Photo Submissions</h2>
      {pending.length === 0 ? (
        <p className="text-parchment/50 text-sm">Nothing pending — the queue is clear.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          <AnimatePresence>
            {pending.map((s) => (
              <motion.div
                key={s.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="quest-ticket flex-col sm:flex-row"
              >
                <div className="quest-ticket__stub w-full sm:w-20 flex-row sm:flex-col">
                  <span className="text-2xl">📸</span>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-center leading-tight">
                    {s.task.xpValue} XP
                  </span>
                </div>
                <div className="quest-ticket__seam hidden sm:block" />
                <div className="quest-ticket__body w-full">
                  <p className="font-semibold">{s.task.title}</p>
                  <p className="text-sm text-parchment-text/70 mb-2">by {s.user.username}</p>
                  <img
                    src={s.photoUrl.startsWith('http') ? s.photoUrl : `${apiBase}${s.photoUrl}`}
                    alt="submission proof"
                    className="w-full max-h-48 object-cover rounded-md mb-3"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => review(s.id, 'approve')}
                      disabled={reviewingId === s.id}
                      className="btn text-xs !py-1.5 flex-1"
                      style={{ backgroundColor: '#5B9279', color: '#F3ECDA', boxShadow: '0 4px 0 #3F6E58' }}
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => review(s.id, 'reject')}
                      disabled={reviewingId === s.id}
                      className="btn btn-danger text-xs !py-1.5 flex-1"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Task/question creation UI intentionally not built yet - use
          `npx prisma studio` from server/ as a GUI in the meantime. */}
    </Layout>
  );
}
