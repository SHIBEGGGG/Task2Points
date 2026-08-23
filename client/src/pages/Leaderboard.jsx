import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext.jsx';
import Layout from '../components/Layout.jsx';

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
      <h1>Leaderboard</h1>
      <button onClick={() => setView('all-time')} disabled={view === 'all-time'}>All-Time</button>
      <button onClick={() => setView('weekly')} disabled={view === 'weekly'}>Weekly</button>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Username</th>
              <th>{view === 'weekly' ? 'Weekly XP' : 'Total XP'}</th>
              {view === 'all-time' && <th>Tasks Completed</th>}
              {view === 'all-time' && <th>Achievements</th>}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} style={row.id === user?.id ? { fontWeight: 'bold' } : undefined}>
                <td>{row.rank}</td>
                <td>{row.username}</td>
                <td>{view === 'weekly' ? row.weeklyXp : row.totalXp}</td>
                {view === 'all-time' && <td>{row.tasksCompleted}</td>}
                {view === 'all-time' && <td>{row.achievementCount}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Layout>
  );
}
