import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import Layout from '../components/Layout.jsx';
import AchievementCard from '../components/AchievementCard.jsx';

export default function Achievements() {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/achievements')
      .then((res) => setAchievements(res.data))
      .catch(() => setError('Could not load achievements. Try refreshing.'))
      .finally(() => setLoading(false));
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
        <p className="font-mono text-parchment/50">Loading badges…</p>
      </Layout>
    );
  }

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl">Achievements</h1>
        <span className="font-mono text-sm text-gold">
          {unlockedCount} / {achievements.length} unlocked
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {achievements.map((a, i) => (
          <motion.div
            key={a.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
          >
            <AchievementCard
              icon={a.icon}
              name={a.name}
              description={a.description}
              unlocked={a.unlocked}
              unlockedAt={a.unlockedAt}
            />
          </motion.div>
        ))}
      </div>
    </Layout>
  );
}
