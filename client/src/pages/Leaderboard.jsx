import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import { useAuth } from '../context/AuthContext.jsx';
import Layout from '../components/Layout.jsx';

const MEDALS = ['🥇', '🥈', '🥉'];

export default function Leaderboard() {
  const { user } = useAuth();
  const [view, setView] = useState('all-time');
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const endpoint = view === 'weekly' ? '/leaderboard/weekly' : '/leaderboard';
    api.get(endpoint).then((res) => {
      setRows(res.data);
      setLoading(false);
    });
  }, [view]);

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl">Leaderboard</h1>
        <div className="flex gap-1 panel !p-1">
          <button
            onClick={() => setView('all-time')}
            className={`px-3 py-1.5 rounded-md text-sm font-semibold transition-colors ${
              view === 'all-time' ? 'bg-gold text-parchment-text' : 'text-parchment/60'
            }`}
          >
            All-Time
          </button>
          <button
            onClick={() => setView('weekly')}
            className={`px-3 py-1.5 rounded-md text-sm font-semibold transition-colors ${
              view === 'weekly' ? 'bg-gold text-parchment-text' : 'text-parchment/60'
            }`}
          >
            Weekly
          </button>
        </div>
      </div>

      {loading ? (
        <p className="font-mono text-parchment/50">Loading rankings…</p>
      ) : (
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {rows.map((row, i) => {
              const isMe = row.id === user?.id;
              return (
                <motion.div
                  key={row.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03, duration: 0.3 }}
                  className={`flex items-center gap-4 rounded-lg px-4 py-3 border ${
                    isMe ? 'border-gold bg-gold/10' : 'border-white/5 bg-ink-light/40'
                  }`}
                >
                  <span className="font-display text-xl w-10 text-center text-gold">
                    {MEDALS[row.rank - 1] || `#${row.rank}`}
                  </span>
                  <span className="flex-1 font-semibold">{row.username}</span>
                  {view === 'all-time' && (
                    <span className="font-mono text-xs text-parchment/50 hidden sm:inline">
                      {row.tasksCompleted} quests · {row.achievementCount} badges
                    </span>
                  )}
                  <span className="font-mono text-gold text-sm">
                    {view === 'weekly' ? row.weeklyXp : row.totalXp} XP
                  </span>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </Layout>
  );
}
