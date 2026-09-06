import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';

const EMPTY_TASK = { type: 'QUIZ', title: '', description: '', category: '', xpValue: 10 };
const EMPTY_QUESTION = { question: '', correctAnswer: '', optionsText: '' };

export default function AdminTaskManager() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);
  const [newTask, setNewTask] = useState(EMPTY_TASK);
  const [expandedTaskId, setExpandedTaskId] = useState(null);
  const [newQuestion, setNewQuestion] = useState(EMPTY_QUESTION);
  const [error, setError] = useState('');

  async function loadTasks() {
    setLoading(true);
    try {
      const res = await api.get('/admin/tasks');
      setTasks(res.data);
    } catch (err) {
      setError('Could not load tasks.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  async function handleCreateTask(e) {
    e.preventDefault();
    try {
      await api.post('/admin/tasks', { ...newTask, xpValue: Number(newTask.xpValue) });
      setNewTask(EMPTY_TASK);
      setShowNewTaskForm(false);
      loadTasks();
    } catch (err) {
      setError(err.response?.data?.error || 'Could not create task');
    }
  }

  async function toggleActive(task) {
    await api.put(`/admin/tasks/${task.id}`, { isActive: !task.isActive });
    loadTasks();
  }

  async function handleCreateQuestion(e, taskId) {
    e.preventDefault();
    const options = newQuestion.optionsText.split(',').map((o) => o.trim()).filter(Boolean);
    try {
      await api.post('/admin/questions', {
        taskId,
        question: newQuestion.question,
        correctAnswer: newQuestion.correctAnswer,
        options,
      });
      setNewQuestion(EMPTY_QUESTION);
      loadTasks();
    } catch (err) {
      setError(err.response?.data?.error || 'Could not add question');
    }
  }

  async function deleteQuestion(id) {
    await api.delete(`/admin/questions/${id}`);
    loadTasks();
  }

  if (loading) return <p className="font-mono text-parchment/50">Loading quests…</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl">Manage Quests</h2>
        <button className="btn btn-primary text-sm !py-2" onClick={() => setShowNewTaskForm((v) => !v)}>
          {showNewTaskForm ? 'Cancel' : '+ New Task'}
        </button>
      </div>

      {error && <p className="text-coral text-sm mb-3">{error}</p>}

      <AnimatePresence>
        {showNewTaskForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleCreateTask}
            className="panel mb-5 space-y-3 overflow-hidden"
          >
            <div className="grid sm:grid-cols-2 gap-3">
              <select
                className="input"
                value={newTask.type}
                onChange={(e) => setNewTask({ ...newTask, type: e.target.value })}
              >
                <option value="QUIZ">Quiz</option>
                <option value="PHOTO">Photo</option>
              </select>
              <input
                className="input"
                type="number"
                min="1"
                placeholder="XP value"
                value={newTask.xpValue}
                onChange={(e) => setNewTask({ ...newTask, xpValue: e.target.value })}
                required
              />
            </div>
            <input
              className="input"
              placeholder="Title"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              required
            />
            <input
              className="input"
              placeholder="Description"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            />
            <input
              className="input"
              placeholder="Category (e.g. housework, fitness)"
              value={newTask.category}
              onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
            />
            <button type="submit" className="btn btn-primary text-sm !py-2">
              Create Task
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="space-y-3">
        {tasks.map((task) => (
          <div key={task.id} className="panel">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <span className="text-xl">{task.type === 'QUIZ' ? '🧠' : '📸'}</span>
                <div className="min-w-0">
                  <p className="font-semibold truncate">{task.title}</p>
                  <p className="font-mono text-[11px] text-parchment/50">
                    {task.xpValue} XP · {task.category || 'uncategorized'} ·{' '}
                    {task.isActive ? 'ACTIVE' : 'INACTIVE'}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                {task.type === 'QUIZ' && (
                  <button
                    className="btn btn-secondary text-xs !py-1.5"
                    onClick={() => setExpandedTaskId(expandedTaskId === task.id ? null : task.id)}
                  >
                    {expandedTaskId === task.id ? 'Hide' : 'Questions'} ({task.quizQuestions?.length || 0})
                  </button>
                )}
                <button className="btn btn-secondary text-xs !py-1.5" onClick={() => toggleActive(task)}>
                  {task.isActive ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {expandedTaskId === task.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 pt-4 border-t border-white/10 overflow-hidden"
                >
                  <ul className="space-y-2 mb-3">
                    {(task.quizQuestions || []).map((q) => (
                      <li key={q.id} className="flex items-start justify-between gap-2 text-sm bg-ink-panel/50 rounded-md p-2">
                        <div>
                          <p>{q.question}</p>
                          <p className="font-mono text-[11px] text-sage">Answer: {q.correctAnswer}</p>
                        </div>
                        <button
                          className="text-coral text-xs shrink-0"
                          onClick={() => deleteQuestion(q.id)}
                        >
                          Delete
                        </button>
                      </li>
                    ))}
                    {(!task.quizQuestions || task.quizQuestions.length === 0) && (
                      <p className="text-parchment/50 text-sm">No questions yet.</p>
                    )}
                  </ul>

                  <form onSubmit={(e) => handleCreateQuestion(e, task.id)} className="space-y-2">
                    <input
                      className="input text-sm"
                      placeholder="Question text"
                      value={newQuestion.question}
                      onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                      required
                    />
                    <input
                      className="input text-sm"
                      placeholder="Correct answer (must match one option exactly)"
                      value={newQuestion.correctAnswer}
                      onChange={(e) => setNewQuestion({ ...newQuestion, correctAnswer: e.target.value })}
                      required
                    />
                    <input
                      className="input text-sm"
                      placeholder="All options, comma-separated (e.g. Paris, Rome, Berlin, Madrid)"
                      value={newQuestion.optionsText}
                      onChange={(e) => setNewQuestion({ ...newQuestion, optionsText: e.target.value })}
                      required
                    />
                    <button type="submit" className="btn btn-primary text-xs !py-1.5">
                      Add Question
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}