import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';

export default function QuizWidget({ task, onCompleted }) {
  const [question, setQuestion] = useState(null);
  const [selected, setSelected] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function startQuiz() {
    setLoading(true);
    setResult(null);
    const res = await api.get(`/quiz/${task.id}/question`);
    setQuestion(res.data);
    setSelected('');
    setLoading(false);
  }

  async function submitAnswer(e) {
    e.preventDefault();
    const res = await api.post(`/quiz/${task.id}/submit`, {
      questionId: question.id,
      answer: selected,
    });
    setResult(res.data);
    if (res.data.correct && res.data.xpAwarded > 0) {
      onCompleted?.();
    }
  }

  if (!question) {
    return (
      <button onClick={startQuiz} className="btn btn-primary text-sm !py-2 mt-3" disabled={loading}>
        {loading ? 'Loading…' : 'Start Quiz'}
      </button>
    );
  }

  return (
    <div className="mt-3">
      <p className="font-semibold text-sm mb-2">{question.question}</p>
      <form onSubmit={submitAnswer} className="space-y-1.5">
        {question.options.map((opt) => (
          <label
            key={opt}
            className={`block text-sm px-3 py-2 rounded-md border cursor-pointer transition-colors ${
              selected === opt ? 'border-gold bg-gold/10' : 'border-ink/15 hover:border-ink/30'
            }`}
          >
            <input
              type="radio"
              name="answer"
              value={opt}
              checked={selected === opt}
              onChange={(e) => setSelected(e.target.value)}
              className="mr-2"
            />
            {opt}
          </label>
        ))}
        <button type="submit" className="btn btn-primary text-sm !py-2 mt-2" disabled={!selected}>
          Submit Answer
        </button>
      </form>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`mt-3 text-sm font-semibold ${result.correct ? 'text-sage-deep' : 'text-coral-deep'}`}
          >
            {result.correct ? `Correct! +${result.xpAwarded} XP` : 'Incorrect — try another question.'}
            {result && !result.correct && (
              <button onClick={startQuiz} className="btn btn-secondary text-xs !py-1.5 mt-2 block">
                Try Another Question
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
