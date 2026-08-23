import { useEffect, useState } from 'react';
import api from '../services/api';
import Layout from '../components/Layout.jsx';

export default function Profile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    api.get('/users/me').then((res) => setProfile(res.data));
  }, []);

  if (!profile) return <Layout><p>Loading...</p></Layout>;

  return (
    <Layout>
      <h1>{profile.username}</h1>
      <p>Level {profile.level.level} - {profile.totalXp} XP</p>
      <p>Rank #{profile.rank}</p>
      <p>Tasks completed: {profile.tasksCompleted}</p>
      <p>Quiz questions correct: {profile.quizCorrect}</p>

      <h2>Achievements</h2>
      <ul>
        {profile.achievements.map((a) => (
          <li key={a.id}>
            {a.icon} {a.name} - unlocked {new Date(a.unlockedAt).toLocaleDateString()}
          </li>
        ))}
      </ul>

      <h2>Recent Completed Tasks</h2>
      <ul>
        {profile.recentCompletions.map((c) => (
          <li key={c.id}>
            {c.task.title} - {c.xpAwarded} XP - {new Date(c.completedAt).toLocaleDateString()}
          </li>
        ))}
      </ul>
    </Layout>
  );
}
