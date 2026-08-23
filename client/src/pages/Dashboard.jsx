import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';
import { useAuth } from '../context/AuthContext.jsx';
import Layout from '../components/Layout.jsx';
import XPBar from '../components/XPBar.jsx';
import LevelBadge from '../components/LevelBadge.jsx';
import QuestTicket from '../components/QuestTicket.jsx';

export default function Dashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [todaysTasks, setTodaysTasks] = useState([]);
  const [pendingSubmissions, setPendingSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const [profileRes, tasksRes, mineRes] = await Promise.all([
          api.get('/users/me'),
          api.get('/tasks/today'),
          api.get('/submissions/mine'),
        ]);
        setProfile(profileRes.data);
        setTodaysTasks(tasksRes.data);
        setPendingSubmissions(mineRes.data.filter((s) => s.status === 'PENDING'));
      } catch (err) {
        setError('Could not load your dashboard. Try refreshing.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

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
        <p className="font-mono text-parchment/50">Loading your quest log…</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex items-center gap-4 mb-8">
        <LevelBadge level={profile.level.level} />
        <div className="flex-1">
          <h1 className="text-2xl mb-1">Welcome back, {user?.username}</h1>
          <XPBar
            level={profile.level.level}
            xpIntoLevel={profile.level.xpIntoLevel}
            xpForNextLevel={profile.level.xpForNextLevel}
          />
        </div>
        <div className="text-right hidden sm:block">
          <p className="font-mono text-xs text-parchment/50">RANK</p>
          <p className="font-display text-2xl text-gold">#{profile.rank}</p>
        </div>
      </div>

      <section className="mb-10">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl">Today's Quests</h2>
          <Link to="/tasks" className="text-sm text-gold hover:underline">
            View all →
          </Link>
        </div>

        {todaysTasks.length === 0 ? (
          <div className="panel text-center py-8">
            <p className="text-parchment/70">All caught up — no quests left to complete.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {todaysTasks.slice(0, 4).map((task) => (
              <QuestTicket
                key={task.id}
                icon={task.type === 'QUIZ' ? '🧠' : '📸'}
                typeLabel={task.type === 'QUIZ' ? 'Quiz' : 'Real World'}
                xpValue={task.xpValue}
              >
                <h3 className="font-semibold">{task.title}</h3>
                <p className="text-sm text-parchment-text/70 mt-1">{task.description}</p>
              </QuestTicket>
            ))}
          </div>
        )}
      </section>

      <div className="grid gap-8 sm:grid-cols-2">
        <section>
          <h2 className="text-xl mb-3">Pending Review</h2>
          {pendingSubmissions.length === 0 ? (
            <p className="text-parchment/50 text-sm">Nothing awaiting review.</p>
          ) : (
            <ul className="space-y-2">
              {pendingSubmissions.map((s) => (
                <motion.li
                  key={s.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="panel flex items-center justify-between text-sm"
                >
                  <span>{s.task.title}</span>
                  <span className="font-mono text-xs text-gold">PENDING</span>
                </motion.li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl">Recent Achievements</h2>
            <Link to="/achievements" className="text-sm text-gold hover:underline">
              View all →
            </Link>
          </div>
          {profile.achievements.length === 0 ? (
            <p className="text-parchment/50 text-sm">None unlocked yet — go complete a quest.</p>
          ) : (
            <ul className="space-y-2">
              {profile.achievements.slice(0, 3).map((a) => (
                <li key={a.id} className="panel flex items-center gap-3 text-sm">
                  <span className="text-xl">{a.icon}</span>
                  <span>{a.name}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </Layout>
  );
}
