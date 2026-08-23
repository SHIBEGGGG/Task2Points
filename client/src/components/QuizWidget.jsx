import { useState } from 'react';
import api from '../services/api';

// Handles fetching a question and submitting an answer for one quiz task.
// Kept as its own component so Tasks.jsx can render one per quiz task card.
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
    return <button onClick={startQuiz} disabled={loading}>{loading ? 'Loading...' : 'Start Quiz'}</button>;
  }

  return (
    <div>
      <p>{question.question}</p>
      <form onSubmit={submitAnswer}>
        {question.options.map((opt) => (
          <label key={opt} style={{ display: 'block' }}>
            <input
              type="radio"
              name="answer"
              value={opt}
              checked={selected === opt}
              onChange={(e) => setSelected(e.target.value)}
            />
            {opt}
          </label>
        ))}
        <button type="submit" disabled={!selected}>Submit Answer</button>
      </form>
      {result && (
        <p>
          {result.correct ? `Correct! +${result.xpAwarded} XP` : 'Incorrect, try another question.'}
        </p>
      )}
      {result && !result.correct && <button onClick={startQuiz}>Try Another Question</button>}
    </div>
  );
}
