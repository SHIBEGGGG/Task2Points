import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext.jsx';
import Layout from '../components/Layout.jsx';

export default function Dashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [todaysTasks, setTodaysTasks] = useState([]);
  const [pendingSubmissions, setPendingSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [profileRes, tasksRes, mineRes] = await Promise.all([
        api.get('/users/me'),
        api.get('/tasks/today'),
        api.get('/submissions/mine'),
      ]);
      setProfile(profileRes.data);
      setTodaysTasks(tasksRes.data);
      setPendingSubmissions(mineRes.data.filter((s) => s.status === 'PENDING'));
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <Layout><p>Loading...</p></Layout>;

  return (
    <Layout>
      <h1>Welcome, {user?.username}</h1>

      <section>
        <h2>Level {profile.level.level}</h2>
        <p>
          {profile.level.xpIntoLevel} / {profile.level.xpForNextLevel} XP to next level
          ({profile.level.progressPercent}%)
        </p>
        <p>Total XP: {profile.totalXp}</p>
        <p>Leaderboard rank: #{profile.rank}</p>
      </section>

      <section>
        <h2>Today's Tasks</h2>
        {todaysTasks.length === 0 && <p>All caught up - no tasks left to complete.</p>}
        <ul>
          {todaysTasks.map((task) => (
            <li key={task.id}>
              {task.type === 'QUIZ' ? '🧠 Quiz Challenge' : '📸 Real World Challenge'}: {task.title} (
              {task.xpValue} XP)
            </li>
          ))}
        </ul>
        <Link to="/tasks">Go to all tasks</Link>
      </section>

      <section>
        <h2>Pending Photo Submissions</h2>
        {pendingSubmissions.length === 0 && <p>None pending.</p>}
        <ul>
          {pendingSubmissions.map((s) => (
            <li key={s.id}>{s.task.title} - awaiting admin review</li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Recent Achievements</h2>
        {profile.achievements.length === 0 && <p>None unlocked yet.</p>}
        <ul>
          {profile.achievements.slice(0, 3).map((a) => (
            <li key={a.id}>
              {a.icon} {a.name}
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  );
}
