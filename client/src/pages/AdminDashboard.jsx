import { useEffect, useState } from 'react';
import api from '../services/api';
import Layout from '../components/Layout.jsx';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadAll() {
    setLoading(true);
    const [statsRes, pendingRes] = await Promise.all([
      api.get('/admin/stats'),
      api.get('/admin/submissions'),
    ]);
    setStats(statsRes.data);
    setPending(pendingRes.data);
    setLoading(false);
  }

  useEffect(() => {
    loadAll();
  }, []);

  async function review(id, decision) {
    await api.put(`/admin/submissions/${id}/${decision}`);
    loadAll();
  }

  if (loading) return <Layout><p>Loading...</p></Layout>;

  return (
    <Layout>
      <h1>Admin Dashboard</h1>

      <section>
        <h2>Stats</h2>
        <p>Users: {stats.userCount}</p>
        <p>Active tasks: {stats.taskCount}</p>
        <p>Pending submissions: {stats.pendingSubmissions}</p>
        <p>Total task completions: {stats.totalCompletions}</p>
      </section>

      <section>
        <h2>Review Photo Submissions</h2>
        {pending.length === 0 && <p>Nothing pending.</p>}
        <ul>
          {pending.map((s) => (
            <li key={s.id}>
              <p>
                {s.user.username} - {s.task.title} ({s.task.xpValue} XP)
              </p>
              <img src={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:4000'}${s.photoUrl}`} alt="submission" width="200" />
              <div>
                <button onClick={() => review(s.id, 'approve')}>Approve</button>
                <button onClick={() => review(s.id, 'reject')}>Reject</button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* NOTE: task/question creation forms are intentionally left out here -
          for now, add tasks and questions via prisma/seed.js or Prisma Studio
          (npm run prisma:studio). Build a proper admin form once you get to
          the UI/UX pass, calling POST /api/admin/tasks and /api/admin/questions. */}
    </Layout>
  );
}
