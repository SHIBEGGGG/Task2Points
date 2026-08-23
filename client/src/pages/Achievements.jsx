import { useEffect, useState } from 'react';
import api from '../services/api';
import Layout from '../components/Layout.jsx';

export default function Achievements() {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/achievements').then((res) => {
      setAchievements(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <Layout><p>Loading...</p></Layout>;

  return (
    <Layout>
      <h1>Achievements</h1>
      <ul>
        {achievements.map((a) => (
          <li key={a.id} style={{ opacity: a.unlocked ? 1 : 0.5 }}>
            <span>{a.icon}</span> <strong>{a.name}</strong> - {a.description}
            {a.unlocked ? (
              <span> (Unlocked {new Date(a.unlockedAt).toLocaleDateString()})</span>
            ) : (
              <span> (Locked)</span>
            )}
          </li>
        ))}
      </ul>
    </Layout>
  );
}
