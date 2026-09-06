import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import { calculateLevel } from '../utils/level.js';
import Layout from '../components/Layout.jsx';
import QuestTicket from '../components/QuestTicket.jsx';
import QuizWidget from '../components/QuizWidget.jsx';
import PhotoUploadWidget from '../components/PhotoUploadWidget.jsx';
import RewardOverlay from '../components/RewardOverlay.jsx';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [knownXp, setKnownXp] = useState(null);
  const [newAchievements, setNewAchievements] = useState([]);
  const [newLevel, setNewLevel] = useState(null);

  async function loadTasks() {
    try {
      const [tasksRes, profileRes] = await Promise.all([api.get('/tasks'), api.get('/users/me')]);
      setTasks(tasksRes.data);
      setKnownXp((prev) => (prev === null ? profileRes.data.totalXp : prev));
    } catch (err) {
      setError('Could not load quests. Try refreshing.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleQuizCompleted(result) {
    if (knownXp !== null) {
      const beforeLevel = calculateLevel(knownXp);
      const afterLevel = calculateLevel(result.totalXp);
      if (afterLevel > beforeLevel) {
        setNewLevel(afterLevel);
      }
    }
    setKnownXp(result.totalXp);

    if (result.newlyUnlocked?.length) {
      setNewAchievements((prev) => [...prev, ...result.newlyUnlocked]);
    }

    loadTasks();
  }

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
      <RewardOverlay
        newAchievements={newAchievements}
        newLevel={newLevel}
        onDismissAchievement={(id) => setNewAchievements((prev) => prev.filter((a) => a.id !== id))}
        onDismissLevelUp={() => setNewLevel(null)}
      />

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
                  <QuizWidget task={task} onCompleted={handleQuizCompleted} />
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