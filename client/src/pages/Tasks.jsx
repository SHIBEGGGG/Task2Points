import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import Layout from '../components/Layout.jsx';
import QuestTicket from '../components/QuestTicket.jsx';
import QuizWidget from '../components/QuizWidget.jsx';
import PhotoUploadWidget from '../components/PhotoUploadWidget.jsx';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadTasks() {
    try {
      const res = await api.get('/tasks');
      setTasks(res.data);
    } catch (err) {
      setError('Could not load quests. Try refreshing.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
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
        <p className="font-mono text-parchment/50">Loading quests…</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <h1 className="text-2xl mb-6">Quest Board</h1>
      <div className="grid gap-5 sm:grid-cols-2">
        <AnimatePresence>
          {tasks.map((task) => (
            <QuestTicket
              key={task.id}
              icon={task.type === 'QUIZ' ? '🧠' : '📸'}
              typeLabel={task.type === 'QUIZ' ? 'Quiz' : 'Real World'}
              xpValue={task.xpValue}
              locked={task.isCompleted}
              stamp={task.isCompleted ? 'COMPLETED' : null}
            >
              <h3 className="font-semibold">{task.title}</h3>
              <p className="text-sm text-parchment-text/70 mt-1">{task.description}</p>

              {!task.isCompleted &&
                (task.type === 'QUIZ' ? (
                  <QuizWidget task={task} onCompleted={loadTasks} />
                ) : (
                  <PhotoUploadWidget task={task} onSubmitted={loadTasks} />
                ))}
            </QuestTicket>
          ))}
        </AnimatePresence>
      </div>
    </Layout>
  );
}
