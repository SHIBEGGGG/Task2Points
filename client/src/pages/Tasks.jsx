import { useEffect, useState } from 'react';
import api from '../services/api';
import Layout from '../components/Layout.jsx';
import QuizWidget from '../components/QuizWidget.jsx';
import PhotoUploadWidget from '../components/PhotoUploadWidget.jsx';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadTasks() {
    const res = await api.get('/tasks');
    setTasks(res.data);
    setLoading(false);
  }

  useEffect(() => {
    loadTasks();
  }, []);

  if (loading) return <Layout><p>Loading...</p></Layout>;

  return (
    <Layout>
      <h1>Tasks</h1>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <h3>
              {task.type === 'QUIZ' ? '🧠 Quiz Challenge' : '📸 Real World Challenge'}: {task.title}
            </h3>
            <p>{task.description}</p>
            <p>{task.xpValue} XP</p>

            {task.isCompleted ? (
              <p>Completed ✅</p>
            ) : task.type === 'QUIZ' ? (
              <QuizWidget task={task} onCompleted={loadTasks} />
            ) : (
              <PhotoUploadWidget task={task} onSubmitted={loadTasks} />
            )}
          </li>
        ))}
      </ul>
    </Layout>
  );
}
