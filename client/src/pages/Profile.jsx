import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import Layout from '../components/Layout.jsx';
import LevelBadge from '../components/LevelBadge.jsx';
import XPBar from '../components/XPBar.jsx';
import PixelIcon from '../components/PixelIcon.jsx';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/users/me')
      .then((res) => setProfile(res.data))
      .catch(() => setError('Could not load your profile. Try refreshing.'));
  }, []);

  if (error) {
    return (
      <Layout>
        <p className="text-coral">{error}</p>
      </Layout>
    );
  }

  if (!profile) {
    return (
      <Layout>
        <p className="font-mono text-parchment/50">Loading profile…</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex items-center gap-4 mb-8">
        <LevelBadge level={profile.level.level} />
        <div className="flex-1">
          <h1 className="text-2xl">{profile.username}</h1>
          <XPBar
            level={profile.level.level}
            xpIntoLevel={profile.level.xpIntoLevel}
            xpForNextLevel={profile.level.xpForNextLevel}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-10">
        {[
          { label: 'Rank', value: `#${profile.rank}` },
          { label: 'Quests Done', value: profile.tasksCompleted },
          { label: 'Quiz Correct', value: profile.quizCorrect },
        ].map((stat) => (
          <div key={stat.label} className="panel text-center">
            <p className="font-display text-2xl text-gold">{stat.value}</p>
            <p className="font-mono text-[10px] text-parchment/50 uppercase tracking-widest mt-1">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      <section className="mb-10">
        <h2 className="text-xl mb-4">Badge Case</h2>
        {profile.achievements.length === 0 ? (
          <p className="text-parchment/50 text-sm">No achievements unlocked yet.</p>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
            {profile.achievements.map((a) => (
              <div
                key={a.id}
                className="panel flex flex-col items-center text-center gap-2 !py-4"
                title={a.description}
              >
                <div className="text-gold">
                  <PixelIcon name={a.icon} size={48} />
                </div>
                <p className="text-xs font-semibold leading-tight">{a.name}</p>
                <p className="font-mono text-[9px] text-parchment/50">
                  {new Date(a.unlockedAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-xl mb-3">Recent Quests</h2>
        <div className="space-y-2">
          {profile.recentCompletions.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="panel flex items-center justify-between text-sm"
            >
              <span>{c.task.title}</span>
              <span className="font-mono text-gold">+{c.xpAwarded} XP</span>
            </motion.div>
          ))}
        </div>
      </section>
    </Layout>
  );
}